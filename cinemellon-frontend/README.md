# Cinemellon — Frontend

A movie and TV show exploration app built with React, TypeScript, and Tailwind CSS. Search, browse trending titles, save favourites, and read AI-generated editorial content — trivia, timelines, hidden details, character analysis, and more — for any movie.

**Live:** https://cine-mellon-frontend.vercel.app

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

By default the app runs entirely on mock data — no backend required. Point it at a running instance of [`cinemellon-backend`](../cinemellon-backend) to switch to live data:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:4000
```

No other changes are needed — `movieService.ts` and `aiService.ts` both check for this variable and call the backend automatically once it's set. No API key is ever held in the frontend; the backend owns those.

## Features

- **Search** — a live-suggestion dropdown plus a full paginated results page, for both movies and series.
- **Movie Details** — a full editorial breakdown (trivia, timeline, hidden details, easter eggs, character analysis, ending explained, cinematography, sound & music, awards, reception, legacy, and more), with per-section "Regenerate with AI" controls.
- **TV Show Details** — season-by-season episode browsing, loaded lazily per season.
- **Trending Discussions** — a paginated feed of discussion cards grounded in real trending movies, with "Load More" and "Refresh".
- **Favourites** — saved locally per browser, no account required.

## Structure

```
src/
  components/    Navbar, Hero, SearchBar, MovieCard, TrendingDiscussion, SimilarMovies, and more
  pages/         Home, Trending, MovieDetails, TvShowDetails, SearchResults, Favourites, Legal, About
  layouts/       MainLayout — navbar, footer, and page outlet
  hooks/         useMovies.ts (TanStack Query wrappers), useFavourites.ts
  services/      movieService.ts, aiService.ts — mock data locally, real backend once VITE_API_BASE_URL is set
  data/          mockMovies.ts — offline/no-backend fallback data
  types/         Shared TypeScript interfaces
  utils/         greetings.ts — rotating hero greetings
```

## Design

- Background `#121212`, accent gradient `#FF6B6B → #FF8E72`, neutral `#FFFFFF`
- Headline face **Playfair Display**, body face **Inter**
- Dark-first, with coral used sparingly for CTAs, active states, and highlights
