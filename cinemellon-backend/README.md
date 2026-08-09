# Cinemellon Backend

Express + TypeScript API for [Cinemellon](../cinemellon) — movie and TV data, AI-generated editorial content, and trending discussions, backed by SQLite.

## Features

- **Movies** — `GET /movie/:id` resolves in three tiers: a hand-curated seed set (Inception, Arrival, The Dark Knight, Interstellar), a SQLite cache of previously-assembled movies, or a fresh TMDB + AI assembly on first request.
- **TV shows** — TVmaze-backed, with season episode lists loaded lazily per season.
- **Search** — TMDB with an OMDB fallback for movies, TVmaze for series, plus AI-assisted typo correction when a search returns nothing.
- **AI insights** — trivia, timeline, hidden details, easter eggs, and iconic quotes, generated on demand via Anthropic or Google Gemini with forced structured JSON output.
- **Trending Discussions** — a growing pool of AI-generated, forum-style discussion cards grounded in real, currently-trending TMDB movies, seeded with 12 hand-written entries.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Required for | Notes |
|---|---|---|
| `TMDB_ACCESS_TOKEN` | Search, any movie beyond the 4 seeded ones | Free "API Read Access Token" at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |
| `OMDB_API_KEY` | Movie search fallback | Optional. Free key at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) |
| `ANTHROPIC_API_KEY` and/or `GEMINI_API_KEY` | AI insights, non-seeded movie details | Set at least one. `AI_PROVIDER` picks between them if both are set; Anthropic is preferred by default |
| `PORT`, `CORS_ORIGIN`, `DATABASE_PATH` | — | Sensible defaults are provided; see `.env.example` |

TVmaze requires no key. Nothing in this repo holds a real credential — `.env` is gitignored.

```bash
npm run seed   # populates the discussions table — run once
npm run dev    # http://localhost:4000 by default
```

The server runs with zero configuration and serves the four seeded movies out of the box. TMDB- and AI-dependent endpoints return a `503` with a clear message until their keys are set, rather than failing silently. `GET /health` reports exactly which integrations are active.

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Server status and which integrations (TMDB, OMDB, AI provider) are configured. |
| `GET` | `/movie/:id` | Full movie details — seed match, cached result, or freshly assembled from TMDB + AI. |
| `GET` | `/search?q=` | Lightweight movie search backing the SearchBar dropdown. |
| `GET` | `/search/movies?q=&page=` | Paginated movie search for the full results page (TMDB, falling back to OMDB). |
| `GET` | `/search/series?q=&page=` | Paginated series search (TVmaze). |
| `GET` | `/search/correct?q=&type=` | Typo correction, called after a zero-result search. `type` is `movie` or `series`. |
| `GET` | `/quick-access` | Currently-in-theaters movies (TMDB "now playing"), falling back to the seed set. |
| `GET` | `/show/:id` | TV show details (TVmaze-backed). |
| `GET` | `/show/:id/season/:seasonId/episodes` | Episode list for one season, fetched lazily. |
| `GET` | `/trending-discussions?page=` | Paginated discussion cards, 4 per page. |
| `GET` | `/trending-discussions/count` | Total discussion count, used by the frontend to pick a random refresh page. |
| `POST` | `/ai/movie-insights` | Regenerates one insight section. Body: `{ movieTitle, section }`, where `section` is one of `trivia`, `timeline`, `hiddenDetails`, `easterEggs`, `quotes`. |

## Architecture notes

- **Movie resolution** (`services/movieAssembly.ts`) checks the seed list first, then the cache, then assembles from scratch: TMDB (or OMDB, for `omdb`-prefixed ids) for factual data, an AI provider for editorial content. Assembled movies are cached indefinitely in SQLite.
- **AI provider selection** (`services/ai/index.ts`) — explicit `AI_PROVIDER` if set, otherwise Anthropic when its key is present, otherwise Gemini. Both providers are called with forced structured output against a shared JSON schema (`services/ai/prompts.ts`), so the response shape is identical regardless of which one answered.
- **Trending Discussions** (`services/discussionsGenerator.ts`) tops up the cache on request, generating fresh cards grounded in TMDB's live trending list and checked against recent entries to avoid repeats.

## Project layout

```
src/
  index.ts                 Express app, route mounting, startup logging
  config.ts                Environment variable loading and integration status
  types.ts                 Shared types, mirroring the frontend's types/movie.ts
  db/
    index.ts                 SQLite connection + schema
    seedMovies.ts             The four hand-curated movies
    seedDiscussions.ts        The 12 seeded discussion threads
    seed.ts                   Seed script (npm run seed)
    discussionsRepo.ts        Paginated discussion queries
    movieCacheRepo.ts         Cache for TMDB/AI-assembled movies
  services/
    tmdb.ts                   TMDB API client
    omdb.ts                   OMDB API client (fallback movie source)
    tvmaze.ts                 TVmaze API client (TV shows)
    httpClient.ts             Fetch wrapper — IPv4 preference, timeout, retry
    movieAssembly.ts          Orchestrates seed/cache/TMDB/AI into one MovieDetails
    discussionsGenerator.ts   Generates and tops up Trending Discussions
    discussionSources.ts      Source-platform link generation for discussion cards
    spellcheck.ts             AI-assisted typo correction
    ai/
      index.ts                  Provider selection
      anthropic.ts               Anthropic client (structured output via tool use)
      gemini.ts                  Gemini client (structured output via responseSchema)
      prompts.ts                 Prompt and JSON schema definitions
  routes/                   One file per endpoint group
  middleware/
    errorHandler.ts          Converts thrown errors into HTTP responses
```

## Wiring up the frontend

No frontend code changes are needed. `movieService.ts` and `aiService.ts` already call these endpoints once `VITE_API_BASE_URL` is set, in the frontend's `.env.local`:

```
VITE_API_BASE_URL=http://localhost:4000
```
