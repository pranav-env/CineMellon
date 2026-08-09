import { useState } from "react";
import { Clock, Star, Loader2 } from "lucide-react";
import { useSeasonEpisodes } from "@/hooks/useMovies";
import { SeasonSummary } from "@/types/movie";
import FunErrorMessage from "@/components/FunErrorMessage";
import PosterImage from "@/components/PosterImage";
import { DETAILS_ERROR } from "@/content/funErrors";

export default function SeasonTabs({ showId, seasons }: { showId: string; seasons: SeasonSummary[] }) {
  const [activeId, setActiveId] = useState(seasons[0]?.id);
  const activeSeason = seasons.find((s) => s.id === activeId) ?? seasons[0];

  const { data: episodes, isLoading, isError } = useSeasonEpisodes(showId, activeSeason?.id, !!activeSeason);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Seasons">
        {seasons.map((season) => (
          <button
            key={season.id}
            role="tab"
            aria-selected={season.id === activeSeason?.id}
            onClick={() => setActiveId(season.id)}
            className={`no-hover-pop shrink-0 whitespace-nowrap rounded-xl2 border px-4 py-2 text-sm font-medium transition-colors ${
              season.id === activeSeason?.id
                ? "border-coral bg-coral text-ink"
                : "border-surface-line text-muted hover:text-bone"
            }`}
          >
            Season {season.seasonNumber}
          </button>
        ))}
      </div>

      {activeSeason && (
        <div className="mt-4 rounded-2xl border border-surface-line bg-surface-raised/40 p-4">
          <div className="flex items-center gap-4">
            <PosterImage
              src={activeSeason.posterUrl}
              alt=""
              compact
              className="h-20 w-14 shrink-0 rounded-lg border border-surface-line object-cover"
            />
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight">{activeSeason.name}</p>
              <p className="mt-1 text-xs text-muted">
                {activeSeason.premiereDate ? new Date(activeSeason.premiereDate).getFullYear() : "—"}
                {activeSeason.episodeCount > 0 &&
                  ` · ${activeSeason.episodeCount} episode${activeSeason.episodeCount === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-surface-line pt-3">
            {isLoading && (
              <div className="flex items-center gap-2 py-4 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading episodes…
              </div>
            )}

            {!isLoading && isError && (
              <div className="py-4">
                <FunErrorMessage error={DETAILS_ERROR} compact />
              </div>
            )}

            {!isLoading && !isError && episodes?.length === 0 && (
              <p className="py-4 text-sm text-muted">No episode data available for this season yet.</p>
            )}

            {!isLoading && !isError && episodes && episodes.length > 0 && (
              <ul className="divide-y divide-surface-line">
                {episodes.map((ep) => (
                  <li key={ep.id} className="py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="text-sm font-medium text-bone">
                        <span className="text-muted">E{ep.episodeNumber}</span> {ep.name}
                      </p>
                      <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
                        {ep.runtimeMinutes > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {ep.runtimeMinutes} min
                          </span>
                        )}
                        {ep.rating !== undefined && (
                          <span className="flex items-center gap-1 text-clay">
                            <Star className="h-3.5 w-3.5 fill-clay" />
                            {ep.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    {ep.summary && <p className="mt-1.5 text-xs leading-relaxed text-muted">{ep.summary}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
