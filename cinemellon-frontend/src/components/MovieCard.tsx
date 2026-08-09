import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { MovieSummary } from "@/types/movie";
import SpotlightCard from "@/components/SpotlightCard";
import PosterImage from "@/components/PosterImage";
import "./MovieCard.css";

export default function MovieCard({
  movie,
  rating,
  basePath = "/movie",
  specularTitle = false,
}: {
  movie: MovieSummary;
  rating?: number;
  basePath?: string;
  /** Opt-in shine-sweep effect on the title (hover). Used on the search
   * results page; off elsewhere so Quick Access and Similar Movies stay
   * plain text. */
  specularTitle?: boolean;
}) {
  return (
    <Link to={`${basePath}/${movie.id}`} className="group block w-full shrink-0 transition-transform duration-300 hover:-translate-y-1">
      <SpotlightCard className="card-spotlight--flush overflow-hidden" spotlightColor="rgba(255, 107, 107, 0.08)">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <PosterImage
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className={`font-display text-base leading-tight ${specularTitle ? "title-specular" : ""}`}>{movie.title}</p>
          <div className="mt-1 flex items-center justify-between text-xs text-muted">
            <span>{movie.year || "—"}</span>
            {rating !== undefined && (
              <span className="flex items-center gap-1 text-clay">
                <Star className="h-3.5 w-3.5 fill-clay text-clay" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
