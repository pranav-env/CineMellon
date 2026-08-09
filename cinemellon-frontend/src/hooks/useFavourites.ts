import { useCallback, useEffect, useState } from "react";
import { MediaType } from "@/types/movie";

const STORAGE_KEY = "cinemellon:favourites";
const CHANGE_EVENT = "cinemellon:favourites-changed";

export interface FavouriteItem {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  rating?: number;
  mediaType: MediaType;
  addedAt: number;
}

function readFavourites(): FavouriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt JSON or storage unavailable (private browsing, etc.) —
    // treat it the same as "no favourites yet" rather than throwing.
    return [];
  }
}

function writeFavourites(items: FavouriteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full/unavailable — favouriting just won't persist for this
    // session. Not worth surfacing as an error to the person.
  }
  // localStorage's native "storage" event only fires in other tabs, never
  // the one that made the change — so components in this tab listen for
  // this custom event instead to stay in sync.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Shared client-side favourites store, backed by localStorage. There's no
 * user-account system in this app, so favourites are per-browser rather
 * than per-account. Every component using this hook stays in sync, both
 * within the tab (the custom event above) and across tabs (the native
 * `storage` event).
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState<FavouriteItem[]>(() => readFavourites());

  useEffect(() => {
    const sync = () => setFavourites(readFavourites());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isFavourite = useCallback(
    (id: string) => favourites.some((f) => f.id === id),
    [favourites]
  );

  const toggleFavourite = useCallback((item: Omit<FavouriteItem, "addedAt">) => {
    const current = readFavourites();
    const exists = current.some((f) => f.id === item.id);
    const next = exists ? current.filter((f) => f.id !== item.id) : [...current, { ...item, addedAt: Date.now() }];
    writeFavourites(next);
    setFavourites(next);
  }, []);

  const removeFavourite = useCallback((id: string) => {
    const current = readFavourites();
    const next = current.filter((f) => f.id !== id);
    writeFavourites(next);
    setFavourites(next);
  }, []);

  return { favourites, isFavourite, toggleFavourite, removeFavourite };
}
