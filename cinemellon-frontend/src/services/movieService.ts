import { MovieDetails, MovieSummary, DiscussionThread, TvShowDetails, TvShowSummary, PaginatedResult, Episode, MediaType } from "@/types/movie";
import { mockMovies, findMovieById, searchMovies, mockDiscussions } from "@/data/mockMovies";

/**
 * Frontend-only mode: reads from mock data with a small artificial delay
 * so loading states can be built and tested honestly.
 *
 * Once VITE_API_BASE_URL is set, every function below talks to the real
 * backend instead. A failed backend request is a real, visible error —
 * thrown up to React Query (or whoever called it), never silently swapped
 * for mock data. Mock data is only used when API_BASE is unset entirely.
 *
 * If VITE_API_BASE_URL is set and you're still seeing mock data: Vite only
 * reads .env at server startup, so changes while `npm run dev` is already
 * running won't take effect until it's restarted.
 */

const SIMULATED_LATENCY_MS = 350;
const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "");

async function backendFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Backend request failed: GET ${path} → ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 300)}` : ""}`);
  }
  return res.json();
}

export async function getMovieById(id: string): Promise<MovieDetails | undefined> {
  if (API_BASE) return backendFetch<MovieDetails>(`/movie/${id}`);
  return delay(findMovieById(id));
}

export async function searchMoviesByQuery(query: string): Promise<MovieSummary[]> {
  if (API_BASE) return backendFetch<MovieSummary[]>(`/search?q=${encodeURIComponent(query)}`);
  return delay(searchMovies(query));
}

export async function getQuickAccessMovies(): Promise<MovieSummary[]> {
  if (API_BASE) return backendFetch<MovieSummary[]>(`/quick-access`);
  return delay(mockMovies.slice(0, 3));
}

export async function getTrendingDiscussions(page: number): Promise<DiscussionThread[]> {
  if (API_BASE) return backendFetch<DiscussionThread[]>(`/trending-discussions?page=${page}`);
  // Simulates pagination by cycling the mock set with a rotating offset —
  // the real backend does an ordinary offset/limit query instead.
  const rotated = [...mockDiscussions.slice(page % mockDiscussions.length), ...mockDiscussions].slice(0, 4);
  return delay(rotated);
}

/** Used to pick a genuinely varied starting page for "Refresh" — see
 * TrendingDiscussion.tsx. */
export async function getTrendingDiscussionsCount(): Promise<number> {
  if (API_BASE) return backendFetch<{ total: number }>(`/trending-discussions/count`).then((r) => r.total);
  return delay(mockDiscussions.length);
}

const EMPTY_PAGE = { results: [], page: 1, totalPages: 0, totalResults: 0 };

/** Full paginated movie search backing the search-results page, distinct
 * from searchMoviesByQuery above (used by the SearchBar dropdown). */
export async function searchMoviesPaginated(query: string, page: number): Promise<PaginatedResult<MovieSummary>> {
  if (API_BASE) return backendFetch<PaginatedResult<MovieSummary>>(`/search/movies?q=${encodeURIComponent(query)}&page=${page}`);
  // No paginated mock data exists — mock mode reuses the small seed-based
  // match set as a single page.
  const matches = searchMovies(query);
  return delay({ results: matches, page: 1, totalPages: matches.length > 0 ? 1 : 0, totalResults: matches.length });
}

/** Paginated TV series search (TVmaze on the backend). No mock/offline
 * data exists for series — mock mode returns an honest empty result. */
export async function searchSeriesPaginated(query: string, page: number): Promise<PaginatedResult<TvShowSummary>> {
  if (API_BASE) return backendFetch(`/search/series?q=${encodeURIComponent(query)}&page=${page}`);
  return delay(EMPTY_PAGE);
}

/** TV show details (TVmaze). No mock/offline data exists for series. */
export async function getTvShowById(id: string): Promise<TvShowDetails | undefined> {
  if (API_BASE) return backendFetch<TvShowDetails>(`/show/${id}`);
  return delay(undefined);
}

/** Lazily fetched when a season is expanded — see TvShowDetails.tsx. No
 * mock/offline data exists for this (series has no mock mode at all). */
export async function getSeasonEpisodes(showId: string, seasonId: number): Promise<Episode[]> {
  if (API_BASE) return backendFetch<Episode[]>(`/show/${showId}/season/${seasonId}/episodes`);
  return delay([]);
}

/** Called only when a search comes back with zero results — see
 * SearchResults.tsx. No mock/offline equivalent (nothing to correct
 * against without a real backend + AI provider). */
export async function checkSearchTypo(query: string, mediaType: MediaType): Promise<{ hasTypo: boolean; corrected: string }> {
  if (API_BASE) return backendFetch(`/search/correct?q=${encodeURIComponent(query)}&type=${mediaType}`);
  return delay({ hasTypo: false, corrected: "" });
}
