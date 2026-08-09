import { MovieDetails, MovieSummary } from "../types.js";
import { findSeedMovie, searchSeedMovies, seedMovies } from "../db/seedMovies.js";
import { getCachedMovie, setCachedMovie } from "../db/movieCacheRepo.js";
import {
  getTmdbMovieFacts,
  getTmdbSimilarMovies,
  getNowPlayingMovies,
  resolveMovieSummaryByTitle,
  searchTmdb,
  TmdbNotConfiguredError,
} from "./tmdb.js";
import { getOmdbMovieFacts } from "./omdb.js";
import { generateStructured } from "./ai/index.js";
import { buildFullInsightPrompt, fullInsightSchema } from "./ai/prompts.js";

/** Shape the model returns for the editorial fields — see fullInsightSchema
 * in prompts.ts. similarMovieTitles is a fallback used only when TMDB's own
 * recommendations come back empty (see resolveSimilarMovies below). */
type GeneratedInsights = Omit<MovieDetails, keyof MovieFacts | "id" | "similarMovies"> & {
  similarMovieTitles: string[];
};

/** Factual data available from both TMDB and OMDB. Editorial content
 * (trivia, timeline, hidden details, etc.) is layered on separately, since
 * neither source provides it. TmdbMovieFacts and OmdbMovieFacts both
 * satisfy this structurally. */
interface MovieFacts {
  title: string;
  year: number;
  tagline: string;
  posterUrl: string;
  genres: string[];
  runtimeMinutes: number;
  director: string;
  rating: number;
  overview: string;
  mainCast: { actor: string; character: string }[];
  supportingCast: string[];
  cinematographer: string;
  musicComposer: string;
  editor: string;
  costumeDesigner: string;
}

/**
 * Resolves an id to a full MovieDetails object, in priority order:
 *   1. Hand-curated seed movie (no external calls)
 *   2. Previously-assembled, cached movie (one DB read)
 *   3. Fresh assembly: TMDB (or OMDB for omdb-prefixed ids) for facts, AI
 *      for editorial content, then cached for next time.
 */
export async function getMovieById(id: string): Promise<MovieDetails | undefined> {
  const seeded = findSeedMovie(id);
  if (seeded) return seeded;

  const cached = getCachedMovie(id);
  if (cached) return cached;

  let assembled: MovieDetails;

  if (id.startsWith("tmdb-")) {
    const tmdbId = Number(id.slice("tmdb-".length));
    if (!Number.isFinite(tmdbId)) return undefined;
    const facts = await getTmdbMovieFacts(tmdbId);
    assembled = await assembleMovie(id, facts, tmdbId);
  } else if (id.startsWith("omdb-")) {
    const imdbId = id.slice("omdb-".length);
    const facts = await getOmdbMovieFacts(imdbId);
    assembled = await assembleMovie(id, facts, undefined);
  } else {
    return undefined; // not an id shape we can resolve
  }

  setCachedMovie(id, assembled);
  return assembled;
}

async function assembleMovie(id: string, facts: MovieFacts, tmdbIdForSimilar: number | undefined): Promise<MovieDetails> {
  const { data: insights } = await generateStructured<GeneratedInsights>(
    buildFullInsightPrompt(facts.title, facts.year, facts.director, facts.overview),
    fullInsightSchema,
    8192
  );

  const similarMovies = await resolveSimilarMovies(tmdbIdForSimilar, insights.similarMovieTitles);

  return {
    id,
    title: facts.title,
    year: facts.year,
    tagline: facts.tagline,
    posterUrl: facts.posterUrl,
    genres: facts.genres,
    runtimeMinutes: facts.runtimeMinutes,
    director: facts.director,
    rating: facts.rating,
    castAndCrew: {
      mainCast: facts.mainCast,
      supportingCast: facts.supportingCast,
      cinematographer: facts.cinematographer,
      musicComposer: facts.musicComposer,
      editor: facts.editor,
      costumeDesigner: facts.costumeDesigner,
      vfxSupervisor: "Unknown",
    },
    spoilerFreeSummary: insights.spoilerFreeSummary,
    trivia: insights.trivia,
    timeline: insights.timeline,
    hiddenDetails: insights.hiddenDetails,
    easterEggs: insights.easterEggs,
    characterAnalysis: insights.characterAnalysis,
    endingExplained: insights.endingExplained,
    cinematography: insights.cinematography,
    soundAndMusic: insights.soundAndMusic,
    iconicQuotes: insights.iconicQuotes,
    awards: insights.awards,
    reception: insights.reception,
    legacy: insights.legacy,
    similarMovies,
  };
}

/**
 * Prefers TMDB's own "similar movies" data (curated, complete with
 * poster/year/rating, no AI needed) when a TMDB id is known. OMDB-sourced
 * movies have no TMDB id and skip straight to the fallback: resolving the
 * AI-suggested titles from this movie's insights to real TMDB entries via
 * search. Titles that don't resolve are dropped rather than failing the
 * request.
 */
async function resolveSimilarMovies(tmdbId: number | undefined, aiSuggestedTitles: string[]): Promise<MovieSummary[]> {
  if (tmdbId !== undefined) {
    try {
      const fromTmdb = await getTmdbSimilarMovies(tmdbId, 4);
      if (fromTmdb.length > 0) return fromTmdb;
    } catch {
      // fall through to the AI-assisted path below
    }
  }

  const resolved = await Promise.all(aiSuggestedTitles.slice(0, 4).map((title) => resolveMovieSummaryByTitle(title)));
  return resolved.filter((x): x is MovieSummary => !!x);
}

/**
 * Merges hand-curated seed matches with live TMDB results, preferring the
 * seed version of a title when both exist. Backs the SearchBar dropdown;
 * routes/searchResults.ts (TMDB/OMDB/TVmaze, paginated) is separate.
 */
export async function searchMovies(query: string): Promise<MovieSummary[]> {
  const seedMatches = searchSeedMovies(query);
  const seedTitles = new Set(seedMatches.map((m) => m.title.toLowerCase()));

  let tmdbMatches: MovieSummary[] = [];
  try {
    tmdbMatches = await searchTmdb(query);
  } catch (err) {
    // If TMDB isn't configured or the request fails, still return whatever
    // seed matches exist rather than failing the whole search.
    if (!(err instanceof TmdbNotConfiguredError)) console.error("[search] TMDB lookup failed:", err);
  }

  const deduped = tmdbMatches.filter((m) => !seedTitles.has(m.title.toLowerCase()));
  return [...seedMatches, ...deduped];
}

/**
 * Live, currently-in-theaters suggestions via TMDB's "now playing" endpoint,
 * falling back to the curated seed set if TMDB isn't configured or the
 * request fails.
 */
export async function getQuickAccessMovies(): Promise<MovieSummary[]> {
  try {
    const nowPlaying = await getNowPlayingMovies(3);
    if (nowPlaying.length > 0) return nowPlaying;
  } catch (err) {
    if (!(err instanceof TmdbNotConfiguredError)) console.error("[quick-access] TMDB lookup failed:", err);
  }
  return seedMovies.slice(0, 3);
}
