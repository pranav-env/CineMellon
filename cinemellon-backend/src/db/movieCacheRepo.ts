import { db } from "./index.js";
import { MovieDetails } from "../types.js";

const getStmt = db.prepare(`SELECT data FROM movie_cache WHERE id = ?`);
const setStmt = db.prepare(`
  INSERT OR REPLACE INTO movie_cache (id, data, created_at) VALUES (?, ?, ?)
`);

/**
 * Cache for movies assembled from TMDB + AI generation (see
 * services/movieAssembly.ts). Seed movies never touch this table — they're
 * served directly from db/seedMovies.ts. No expiry: assembled content is
 * cached indefinitely; delete a row (or the gitignored .db file) to force
 * regeneration.
 */
export function getCachedMovie(id: string): MovieDetails | undefined {
  const row = getStmt.get(id) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as MovieDetails) : undefined;
}

export function setCachedMovie(id: string, movie: MovieDetails): void {
  setStmt.run(id, JSON.stringify(movie), Date.now());
}
