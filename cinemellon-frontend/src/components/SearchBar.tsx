import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { useSearchSuggestions } from "@/hooks/useMovies";
import SpecularButton from "@/components/SpecularButton";
import FunErrorMessage from "@/components/FunErrorMessage";
import PosterImage from "@/components/PosterImage";
import { SEARCH_ERROR } from "@/content/funErrors";
import { MediaType } from "@/types/movie";
import sparkleIcon from "@/assets/sparkle-icon.svg";

interface SearchBarProps {
  mediaType: MediaType;
}

export default function SearchBar({ mediaType }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isFetching, isError } = useSearchSuggestions(query, mediaType);
  const showDropdown = focused && query.trim().length > 1;
  const label = mediaType === "movie" ? "movies" : "series";

  // Rendered via portal (see below), so "click away" has to check both the
  // input wrapper and the portaled dropdown — they're no longer the same
  // DOM subtree, even though they're the same React subtree.
  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      const target = e.target as Node;
      const insideWrapper = wrapperRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideWrapper && !insideDropdown) setFocused(false);
    }
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  // Portaled content is positioned via fixed coordinates computed from the
  // input's real location, since it no longer lives inside the `relative`-
  // positioned wrapper in the DOM tree. Kept in sync with resize/scroll
  // while showing.
  const updateRect = useCallback(() => {
    if (!wrapperRef.current) return;
    const r = wrapperRef.current.getBoundingClientRect();
    setDropdownRect({ top: r.bottom + 8, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [showDropdown, updateRect]);

  function goToDetails(id: string) {
    setFocused(false);
    setQuery("");
    navigate(mediaType === "movie" ? `/movie/${id}` : `/show/${id}`);
  }

  // "Curate" takes the whole query to the full search-results page (with
  // pagination) rather than jumping to a single guessed result; picking a
  // specific title is the dropdown suggestions' job below.
  function handleCurate() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setFocused(false);
    navigate(`/results?type=${mediaType}&q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-3 rounded-xl2 border border-surface-line bg-surface-raised/90 px-5 py-3 shadow-card backdrop-blur">
        <Search className="h-5 w-5 shrink-0 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === "Enter" && handleCurate()}
          placeholder={mediaType === "movie" ? "Search Moovies" : "Search Seeries"}
          aria-label={`Search for a ${mediaType === "movie" ? "movie" : "series"}`}
          className="min-w-0 flex-1 bg-transparent font-display italic text-lg text-bone placeholder:text-muted focus:outline-none"
        />
        <SpecularButton
          size="md"
          radius={20}
          tint="#FF6B6B"
          tintOpacity={1}
          textColor="#121212"
          lineColor="#FFFFFF"
          baseColor="#FF8E72"
          intensity={0.55}
          shineSize={9}
          shineFade={45}
          thickness={1.2}
          speed={0.35}
          followMouse
          proximity={130}
          onClick={handleCurate}
          disabled={query.trim().length === 0}
          className="shrink-0"
        >
          <img src={sparkleIcon} alt="" className="h-5 w-5" />
          <span className="sr-only">Curate — see full search results</span>
        </SpecularButton>
      </div>

      {showDropdown &&
        dropdownRect &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: "fixed", top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
            className="z-[100] max-h-[400px] overflow-y-auto overflow-x-hidden rounded-2xl border border-surface-line bg-surface-raised shadow-card"
          >
            {isFetching && (
              <div className="space-y-2 px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Searching…
                </div>
                <div className="h-10 w-full animate-pulse rounded-lg bg-surface-line/40" />
              </div>
            )}
            {!isFetching && isError && <FunErrorMessage error={SEARCH_ERROR} compact />}
            {!isFetching && !isError && results.length === 0 && (
              <p className="px-5 py-4 text-sm text-muted">No {label} match "{query}" yet.</p>
            )}
            {!isFetching &&
              !isError &&
              results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => goToDetails(item.id)}
                  className="no-hover-pop group flex w-full items-center gap-3 overflow-hidden px-5 py-3 text-left transition-colors hover:bg-surface-line/40"
                >
                  <PosterImage
                    src={item.posterUrl}
                    alt=""
                    compact
                    className="h-12 w-8 shrink-0 rounded object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className="min-w-0 transition-transform duration-200 group-hover:scale-105">
                    <span className="block truncate text-sm font-medium">{item.title}</span>
                    <span className="block text-xs text-muted">{item.year || "—"}</span>
                  </span>
                </button>
              ))}
          </div>,
          document.body
        )}
    </div>
  );
}
