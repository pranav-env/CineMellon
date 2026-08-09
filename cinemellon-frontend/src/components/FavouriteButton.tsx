import { Heart } from "lucide-react";
import { useFavourites, type FavouriteItem } from "@/hooks/useFavourites";

export default function FavouriteButton({
  item,
  className = "",
}: {
  item: Omit<FavouriteItem, "addedAt">;
  className?: string;
}) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const active = isFavourite(item.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavourite(item)}
      aria-pressed={active}
      aria-label={active ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl2 border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-coral bg-coral/10 text-coral"
          : "border-surface-line text-muted hover:border-coral/50 hover:text-coral"
      } ${className}`}
    >
      <Heart className={`h-4 w-4 transition-transform ${active ? "scale-110 fill-coral" : ""}`} />
      {active ? "Favourited" : "Add to Favourites"}
    </button>
  );
}
