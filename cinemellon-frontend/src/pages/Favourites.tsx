import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavourites } from "@/hooks/useFavourites";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Reveal from "@/components/Reveal";

const PAGE_SIZE = 12;

export default function Favourites() {
  const { favourites } = useFavourites();
  const [searchParams, setSearchParams] = useSearchParams();

  // Most recently added first — the natural default for a saved-items list.
  const sorted = useMemo(() => [...favourites].sort((a, b) => b.addedAt - a.addedAt), [favourites]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  // Clamp against totalPages so a stale/bookmarked ?page= from before some
  // favourites were removed doesn't land on a blank page. Safe to do
  // synchronously — the full list is already in hand from localStorage.
  const requestedPage = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const page = Math.min(requestedPage, totalPages);

  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Your list</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Favourites</h1>
          {favourites.length > 0 && (
            <p className="mt-2 text-sm text-muted">
              {favourites.length} title{favourites.length === 1 ? "" : "s"} saved
            </p>
          )}
        </Reveal>

        {favourites.length === 0 ? (
          <div className="mt-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-faint" />
            <p className="mt-4 text-sm text-muted">
              No favourites yet — tap the heart on any movie or series page to save it here.
            </p>
            <Link to="/" className="mt-4 inline-block text-sm text-coral hover:text-clay">
              Browse movies &amp; series
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {pageItems.map((fav) => (
                <MovieCard
                  key={fav.id}
                  movie={fav}
                  rating={fav.rating}
                  basePath={fav.mediaType === "movie" ? "/movie" : "/show"}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
