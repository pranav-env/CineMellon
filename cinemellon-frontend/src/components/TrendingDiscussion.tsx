import { useMemo, useState } from "react";
import { ExternalLink, RefreshCw, ChevronDown, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrendingDiscussions } from "@/hooks/useMovies";
import { getTrendingDiscussionsCount } from "@/services/movieService";
import SpecularButton from "@/components/SpecularButton";
import SpotlightCard from "@/components/SpotlightCard";
import type { DiscussionThread } from "@/types/movie";

// Must match the backend's PAGE_SIZE (db/discussionsRepo.ts). Used only to
// compute a valid random starting page for Refresh — the backend remains
// the source of truth for what a page actually contains.
const PAGE_SIZE = 4;

export default function TrendingDiscussion() {
  const [seed, setSeed] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useTrendingDiscussions(seed, startPage);

  // Flatten the accumulated pages and drop repeats, checked two ways: by id
  // (in case generation ever produces a collision) and by normalized
  // movieTitle + title, since separate AI-generated batches can
  // independently land on the same talking point under different ids.
  const discussions = useMemo(() => {
    const seenIds = new Set<string>();
    const seenContent = new Set<string>();
    const result: DiscussionThread[] = [];
    for (const page of data?.pages ?? []) {
      for (const item of page) {
        if (seenIds.has(item.id)) continue;
        const contentKey = `${item.movieTitle.trim().toLowerCase()}||${item.title.trim().toLowerCase()}`;
        if (seenContent.has(contentKey)) continue;
        seenIds.add(item.id);
        seenContent.add(contentKey);
        result.push(item);
      }
    }
    return result;
  }, [data]);

  const isRefreshing = (isFetching && !isFetchingNextPage) || refreshing;

  const handleRefresh = async () => {
    // New content is appended at the end of the pool, so jumping back to
    // page 0 would always show the same oldest items. Pick a random valid
    // page instead, then bump the seed to force a fresh fetch from there.
    setRefreshing(true);
    try {
      const total = await getTrendingDiscussionsCount();
      const maxPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
      // Exclude the page currently on screen so Refresh reliably shows
      // something different rather than occasionally re-landing on it.
      let nextStartPage = 0;
      if (maxPage > 0) {
        nextStartPage = Math.floor(Math.random() * maxPage);
        if (nextStartPage >= startPage) nextStartPage += 1;
      }
      setStartPage(nextStartPage);
    } catch {
      // If even the count check fails, at least still restart from the top
      // rather than doing nothing.
      setStartPage(0);
    } finally {
      setSeed((s) => s + 1);
      setRefreshing(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 2xl:max-w-[1400px]">
      <div className="lg:flex lg:items-start lg:gap-12">
        {/* Left: big stacked heading + Refresh — stays put on desktop while cards scroll beside it */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between lg:mb-0 lg:flex-shrink-0 lg:flex-col lg:items-start lg:gap-6 lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display leading-[0.95]">
            <span className="block text-3xl sm:text-4xl">Trending</span>
            <span className="block text-4xl font-semibold sm:text-5xl">Discussions</span>
          </h2>
          <SpecularButton
            size="sm"
            radius={20}
            tint="#FFFFFF"
            tintOpacity={0.03}
            textColor="#A6A6AA"
            lineColor="#FF8E72"
            baseColor="#3A3A3A"
            intensity={0.5}
            shineSize={8}
            shineFade={45}
            thickness={1}
            speed={0.3}
            followMouse
            proximity={110}
            onClick={handleRefresh}
            disabled={isFetching || refreshing}
            className="border border-surface-line"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </SpecularButton>
        </div>

        {/* Right: the cards, filling the remaining width */}
        <div className="min-w-0 flex-1">
          {/* mode="wait" so the outgoing state fully fades out before the
              next fades in — clean and predictable across three very
              different shapes (skeleton / empty / cards), rather than an
              abrupt cut or mid-transition overlap. */}
          <AnimatePresence mode="wait">
            {discussions.length === 0 && isFetching && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                aria-label="Loading trending discussions"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-60 animate-pulse rounded-2xl border border-surface-line bg-surface-raised/50"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </motion.div>
            )}

            {discussions.length === 0 && !isFetching && (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-muted"
              >
                No discussions yet — hit the refresh button.
              </motion.p>
            )}

            {discussions.length > 0 && (
              <motion.div
                key="cards"
                initial={false}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {discussions.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: (i % 4) * 0.05, duration: 0.5, ease: "easeOut" }}
                  >
                    {/* min-height (not fixed) plus a clamped title keeps
                        cards visually consistent without cutting off the
                        AI-generated excerpt, whose length varies. The card
                        itself isn't a link — only "Sourced from …" is. */}
                    <SpotlightCard spotlightColor="rgba(255, 107, 107, 0.08)" className="flex min-h-60 flex-col">
                      <p className="truncate text-xs font-semibold uppercase tracking-wide text-coral">
                        {d.movieTitle}
                      </p>
                      <h3 className="mt-2 line-clamp-2 font-display text-lg leading-snug">{d.title}</h3>
                      <p className="mt-2 text-sm text-muted">{d.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-faint">
                        <a
                          href={d.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 inline-flex items-center gap-1 text-coral transition-colors hover:text-clay"
                        >
                          Sourced from {d.sourceName}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          AI curated
                        </span>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {hasNextPage && (
            <div className="mt-10 flex justify-end">
              <SpecularButton
                size="sm"
                radius={20}
                tint="#FFFFFF"
                tintOpacity={0.04}
                textColor="#FFFFFF"
                lineColor="#FF6B6B"
                baseColor="#3A3A3A"
                intensity={0.55}
                shineSize={8}
                shineFade={45}
                thickness={1}
                speed={0.3}
                followMouse
                proximity={120}
                onClick={() => fetchNextPage()}
                disabled={isFetching}
                className="border border-surface-line"
              >
                Load More
                {isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
              </SpecularButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
