import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSearchResults } from "@/hooks/useMovies";
import { checkSearchTypo } from "@/services/movieService";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Reveal from "@/components/Reveal";
import FunErrorMessage from "@/components/FunErrorMessage";
import { SEARCH_ERROR } from "@/content/funErrors";
import { MediaType } from "@/types/movie";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const mediaType: MediaType = searchParams.get("type") === "series" ? "series" : "movie";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading, isError } = useSearchResults(query, mediaType, page);
  const results = data?.results ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalResults = data?.totalResults ?? 0;

  const basePath = mediaType === "movie" ? "/movie" : "/show";
  const label = mediaType === "movie" ? "movies" : "series";

  // Typo correction: only kicks in on a genuine zero-result search, and only
  // once per distinct query string (attemptedRef), so a corrected query that
  // itself comes back empty doesn't try to "correct" again indefinitely.
  const [checkingTypo, setCheckingTypo] = useState(false);
  const [correctedFrom, setCorrectedFrom] = useState<string | null>(null);
  const attemptedRef = useRef<Set<string>>(new Set());
  const lastCorrectedToRef = useRef<string | null>(null);

  useEffect(() => {
    // A fresh, manually-entered query (not one we just corrected to)
    // clears any previous "did you mean" note.
    if (query !== lastCorrectedToRef.current) setCorrectedFrom(null);
  }, [query]);

  useEffect(() => {
    if (!query || isLoading || isError || results.length > 0) return;
    if (attemptedRef.current.has(query)) return;
    attemptedRef.current.add(query);

    let cancelled = false;
    setCheckingTypo(true);

    checkSearchTypo(query, mediaType)
      .then((result) => {
        if (cancelled) return;
        if (result.hasTypo && result.corrected && result.corrected.toLowerCase() !== query.toLowerCase()) {
          lastCorrectedToRef.current = result.corrected;
          setCorrectedFrom(query);
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("q", result.corrected);
            next.set("page", "1");
            return next;
          });
        }
      })
      .catch(() => {
        // Silently give up — the person just sees the ordinary
        // zero-results state, same as if this feature didn't exist.
      })
      .finally(() => {
        if (!cancelled) setCheckingTypo(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mediaType, isLoading, isError, results.length]);

  function goToPage(newPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pt-10">
      <div className="mx-auto max-w-6xl px-6 pb-24 2xl:max-w-[1400px]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Search results</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">
            {query ? `"${query}"` : "Results"}
            <span className="ml-3 text-lg font-normal capitalize text-muted">— {label}</span>
          </h1>
          {correctedFrom && (
            <p className="mt-2 text-sm text-muted">
              Showing results for <span className="text-bone">"{query}"</span> — you searched for "{correctedFrom}"
            </p>
          )}
          {!isLoading && totalResults > 0 && (
            <p className="mt-2 text-sm text-muted">
              {totalResults.toLocaleString()} result{totalResults === 1 ? "" : "s"}
            </p>
          )}
        </Reveal>

        {!query && <p className="mt-10 text-sm text-muted">Search for a {mediaType === "movie" ? "movie" : "series"} to see results here.</p>}

        {query && isLoading && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-2xl bg-surface-raised/50" />
            ))}
          </div>
        )}

        {query && !isLoading && isError && (
          <div className="mt-10">
            <FunErrorMessage error={SEARCH_ERROR} />
          </div>
        )}

        {query && !isLoading && !isError && results.length === 0 && (
          <div className="mt-10">
            {checkingTypo ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking for a possible typo…
              </p>
            ) : (
              <p className="text-sm text-muted">
                No {label} found for "{query}". Try a different title, or check the other toggle above the search bar.
              </p>
            )}
          </div>
        )}

        {query && !isLoading && !isError && results.length > 0 && (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((item) => (
                <MovieCard key={item.id} movie={item} rating={item.rating} basePath={basePath} specularTitle />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
