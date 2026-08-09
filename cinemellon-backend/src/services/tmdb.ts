import { config } from "../config.js";
import { MovieSummary } from "../types.js";
import { resilientFetch } from "./httpClient.js";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export class TmdbNotConfiguredError extends Error {
  constructor() {
    super("TMDB_ACCESS_TOKEN is not set — add it to .env to enable search and movie lookups beyond the seed set.");
    this.name = "TmdbNotConfiguredError";
  }
}

function posterUrl(posterPath: string | null): string {
  // Falls back to a plain placeholder rather than a broken image — TMDB
  // doesn't have posters for every title, especially very new or obscure ones.
  return posterPath ? `${IMAGE_BASE}${posterPath}` : "https://placehold.co/500x750/191919/A6A6AA?text=No+Poster";
}

async function tmdbFetch<T>(path: string): Promise<T> {
  if (!config.tmdbAccessToken) throw new TmdbNotConfiguredError();

  const res = await resilientFetch(`${TMDB_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${config.tmdbAccessToken}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TMDB request failed (${res.status} ${res.statusText}) for ${path}: ${body.slice(0, 300)}`);
  }

  return res.json() as Promise<T>;
}

interface TmdbSearchResult {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
  overview: string;
  vote_average: number;
}

interface TmdbSearchResponse {
  results: TmdbSearchResult[];
}

export async function searchTmdb(query: string, limit = 8): Promise<MovieSummary[]> {
  const data = await tmdbFetch<TmdbSearchResponse>(`/search/movie?query=${encodeURIComponent(query)}&include_adult=false`);
  return data.results.slice(0, limit).map((r) => ({
    id: `tmdb-${r.id}`,
    title: r.title,
    year: r.release_date ? Number(r.release_date.slice(0, 4)) : 0,
    posterUrl: posterUrl(r.poster_path),
    rating: Math.round(r.vote_average * 10) / 10,
  }));
}

interface TmdbCastMember {
  name: string;
  character: string;
  order: number;
}

interface TmdbCrewMember {
  name: string;
  job: string;
}

interface TmdbMovieResponse {
  id: number;
  title: string;
  release_date: string | null;
  runtime: number | null;
  genres: { id: number; name: string }[];
  overview: string;
  poster_path: string | null;
  vote_average: number;
  tagline: string;
  credits?: {
    cast: TmdbCastMember[];
    crew: TmdbCrewMember[];
  };
}

/** The subset of factual data TMDB actually provides — everything editorial
 * (trivia, timeline, hidden details, etc.) is layered on separately in
 * services/movieAssembly.ts, since TMDB has no concept of that content. */
export interface TmdbMovieFacts {
  tmdbId: number;
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

export async function getTmdbMovieFacts(tmdbId: number): Promise<TmdbMovieFacts> {
  const data = await tmdbFetch<TmdbMovieResponse>(`/movie/${tmdbId}?append_to_response=credits`);

  const crew = data.credits?.crew ?? [];
  const findCrew = (job: string) => crew.find((c) => c.job === job)?.name ?? "Unknown";

  const cast = [...(data.credits?.cast ?? [])].sort((a, b) => a.order - b.order);

  return {
    tmdbId: data.id,
    title: data.title,
    year: data.release_date ? Number(data.release_date.slice(0, 4)) : 0,
    tagline: data.tagline || "",
    posterUrl: posterUrl(data.poster_path),
    genres: data.genres.map((g) => g.name),
    runtimeMinutes: data.runtime ?? 0,
    director: findCrew("Director"),
    rating: Math.round(data.vote_average * 10) / 10,
    overview: data.overview,
    mainCast: cast.slice(0, 4).map((c) => ({ actor: c.name, character: c.character })),
    supportingCast: cast.slice(4, 9).map((c) => c.name),
    cinematographer: findCrew("Director of Photography"),
    musicComposer: findCrew("Original Music Composer"),
    editor: findCrew("Editor"),
    costumeDesigner: findCrew("Costume Design"),
  };
}

interface TmdbPaginatedResponse {
  results: TmdbSearchResult[];
  page: number;
  total_pages: number;
  total_results: number;
}

/**
 * Paginated search backing the full search-results page in
 * routes/searchResults.ts, distinct from searchTmdb (used by the SearchBar
 * dropdown). Maps directly onto TMDB's native page parameter.
 */
export async function searchTmdbPaginated(query: string, page: number) {
  const data = await tmdbFetch<TmdbPaginatedResponse>(
    `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&page=${page}`
  );
  return {
    results: data.results.map((r) => ({
      id: `tmdb-${r.id}`,
      title: r.title,
      year: r.release_date ? Number(r.release_date.slice(0, 4)) : 0,
      posterUrl: posterUrl(r.poster_path),
      rating: Math.round(r.vote_average * 10) / 10,
    })),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

/** Currently-in-theaters movies — used for the "You may be looking for"
 * section on the homepage, so those suggestions are genuinely current
 * rather than a fixed hardcoded set. */
export async function getNowPlayingMovies(limit = 3): Promise<MovieSummary[]> {
  const data = await tmdbFetch<TmdbSearchResponse>(`/movie/now_playing`);
  return data.results.slice(0, limit).map((r) => ({
    id: `tmdb-${r.id}`,
    title: r.title,
    year: r.release_date ? Number(r.release_date.slice(0, 4)) : 0,
    posterUrl: posterUrl(r.poster_path),
    rating: Math.round(r.vote_average * 10) / 10,
  }));
}

/** Best-effort title -> MovieSummary lookup, used to resolve AI-suggested
 * "similar movie" titles into displayable entries. Returns undefined
 * rather than throwing if nothing is found. */
export async function resolveMovieSummaryByTitle(title: string): Promise<MovieSummary | undefined> {
  try {
    const results = await searchTmdb(title, 1);
    return results[0];
  } catch {
    return undefined;
  }
}

/** TMDB's own "similar movies" data, the primary source for
 * MovieDetails.similarMovies. The AI-suggested-titles fallback in
 * movieAssembly.ts only kicks in when this comes back empty. */
export async function getTmdbSimilarMovies(tmdbId: number, limit = 4): Promise<MovieSummary[]> {
  const data = await tmdbFetch<TmdbSearchResponse>(`/movie/${tmdbId}/recommendations`);
  return data.results.slice(0, limit).map((r) => ({
    id: `tmdb-${r.id}`,
    title: r.title,
    year: r.release_date ? Number(r.release_date.slice(0, 4)) : 0,
    posterUrl: posterUrl(r.poster_path),
    rating: Math.round(r.vote_average * 10) / 10,
  }));
}

/** TMDB's "popular this week" endpoint, used to ground AI-generated
 * discussion content in real, currently-trending titles. */
export async function getTrendingMovies(limit = 20): Promise<{ tmdbId: number; title: string }[]> {
  const data = await tmdbFetch<TmdbSearchResponse>(`/trending/movie/week`);
  return data.results.slice(0, limit).map((r) => ({ tmdbId: r.id, title: r.title }));
}
