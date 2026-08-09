import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getMovieById,
  searchMoviesByQuery,
  getQuickAccessMovies,
  getTrendingDiscussions,
  searchMoviesPaginated,
  searchSeriesPaginated,
  getTvShowById,
  getSeasonEpisodes,
} from "@/services/movieService";
import { MediaType } from "@/types/movie";

export const useMovie = (id: string | undefined) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id as string),
    enabled: !!id,
  });

export const useTvShow = (id: string | undefined) =>
  useQuery({
    queryKey: ["tv-show", id],
    queryFn: () => getTvShowById(id as string),
    enabled: !!id,
  });

/** Gated by `enabled` — the lazy-load half of the seasons/episodes design
 * (see backend services/tvmaze.ts for why episodes aren't embedded in
 * useTvShow). `enabled` reflects whether this season is the active tab
 * (see SeasonTabs.tsx). */
export const useSeasonEpisodes = (showId: string | undefined, seasonId: number | undefined, enabled: boolean) =>
  useQuery({
    queryKey: ["season-episodes", showId, seasonId],
    queryFn: () => getSeasonEpisodes(showId as string, seasonId as number),
    enabled: !!showId && !!seasonId && enabled,
  });

export const useMovieSearch = (query: string) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMoviesByQuery(query),
    enabled: query.trim().length > 1,
  });

/** Powers the SearchBar dropdown for both toggle states — movie search
 * reuses useMovieSearch's query key and behavior; series uses the
 * paginated series search, taking just its first page for suggestions. */
export const useSearchSuggestions = (query: string, mediaType: MediaType) =>
  useQuery({
    queryKey: mediaType === "movie" ? ["search", query] : ["search-series-suggestions", query],
    queryFn: () =>
      mediaType === "movie" ? searchMoviesByQuery(query) : searchSeriesPaginated(query, 1).then((r) => r.results),
    enabled: query.trim().length > 1,
  });

/** Powers the full search-results page reached via the Curate button. */
export const useSearchResults = (query: string, mediaType: MediaType, page: number) =>
  useQuery({
    queryKey: ["search-results", mediaType, query, page],
    queryFn: () => (mediaType === "movie" ? searchMoviesPaginated(query, page) : searchSeriesPaginated(query, page)),
    enabled: query.trim().length > 0,
  });

export const useQuickAccessMovies = () =>
  useQuery({
    queryKey: ["quick-access"],
    queryFn: getQuickAccessMovies,
  });

export const useTrendingDiscussions = (seed: number, startPage = 0) =>
  useInfiniteQuery({
    queryKey: ["trending-discussions", seed],
    queryFn: ({ pageParam }) => getTrendingDiscussions(pageParam),
    initialPageParam: startPage,
    // Stop offering "Load More" once a page comes back short — offset
    // pagination against a finite dataset naturally signals "no more" the
    // moment it runs past the end.
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === 0 ? undefined : lastPageParam + 1,
    // Not using placeholderData: keepPreviousData — seed only changes on
    // Refresh, and the old cards should clear back to the loading skeleton
    // before the new page renders, rather than linger and swap abruptly.
    // "Load More" (fetchNextPage) never changes the query key, so existing
    // pages are unaffected and simply grow.
  });
