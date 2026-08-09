import { useEffect, useState, lazy, Suspense } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Trending from "@/pages/Trending";
import MovieDetails from "@/pages/MovieDetails";
import TvShowDetails from "@/pages/TvShowDetails";
import SearchResults from "@/pages/SearchResults";
import Favourites from "@/pages/Favourites";
import About from "@/pages/About";
import ScrollToTop from "@/components/ScrollToTop";
import AppLoader from "@/components/AppLoader";
import ClickFeedback from "@/components/ClickFeedback";
import { getTrendingDiscussions, getQuickAccessMovies } from "@/services/movieService";

// react-markdown + remark-gfm + rehype-slug add real weight and are only
// needed on this rarely-visited page — lazy-loaded to keep them out of the
// main bundle.
const Legal = lazy(() => import("@/pages/Legal"));

// Floor on how long the splash stays up, so it reads as an intentional
// branded moment rather than a flash even when queries resolve almost
// instantly.
const MIN_SPLASH_MS = 700;

const TRENDING_DISCUSSIONS_KEY = ["trending-discussions", 0];
const QUICK_ACCESS_KEY = ["quick-access"];

export default function App() {
  const queryClient = useQueryClient();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  // Latches once the splash has been dismissed. Without this, the splash
  // would re-open any time a later fetch shares a query-key prefix with
  // TRENDING_DISCUSSIONS_KEY or QUICK_ACCESS_KEY — e.g. clicking "Load
  // More" — instead of gating only the very first load.
  const [hasShownOnce, setHasShownOnce] = useState(false);

  // Kick both fetches off up front, under the same query keys their hooks
  // use, so they're already in flight by the time Home mounts.
  useEffect(() => {
    queryClient
      .prefetchInfiniteQuery({
        queryKey: TRENDING_DISCUSSIONS_KEY,
        queryFn: ({ pageParam }) => getTrendingDiscussions(pageParam as number),
        initialPageParam: 0,
      })
      .catch(() => {
        // A failed prefetch shouldn't block the app from loading — the
        // query below still settles to an error state either way.
      });

    queryClient
      .prefetchQuery({ queryKey: QUICK_ACCESS_KEY, queryFn: getQuickAccessMovies })
      .catch(() => {});
  }, [queryClient]);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // Observes the real queries' fetch status directly, so the splash stays
  // up for exactly as long as that data is genuinely still loading.
  const trendingIsFetching = useIsFetching({ queryKey: TRENDING_DISCUSSIONS_KEY }) > 0;
  const quickAccessIsFetching = useIsFetching({ queryKey: QUICK_ACCESS_KEY }) > 0;
  const appReady = minTimeElapsed && !trendingIsFetching && !quickAccessIsFetching;

  useEffect(() => {
    if (appReady) setHasShownOnce(true);
  }, [appReady]);

  // Stays false forever once hasShownOnce flips true (see above).
  const showSplash = !hasShownOnce && !appReady;

  return (
    <>
      <ScrollToTop />
      <ClickFeedback />
      <AppLoader visible={showSplash} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/show/:id" element={<TvShowDetails />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/legal"
            element={
              <Suspense fallback={<div className="pt-24 text-center text-sm text-muted">Loading…</div>}>
                <Legal />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
