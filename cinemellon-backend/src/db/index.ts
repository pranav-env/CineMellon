import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { config } from "../config.js";

mkdirSync(dirname(config.databasePath), { recursive: true });

export const db = new Database(config.databasePath);
db.pragma("journal_mode = WAL");

db.exec(`
  -- Fully-assembled MovieDetails for movies beyond the hand-curated seed set
  -- (see db/seedMovies.ts): one TMDB fetch + one AI generation call on first
  -- request, then served from here.
  CREATE TABLE IF NOT EXISTS movie_cache (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  -- Trending Discussions, seeded via 'npm run seed'. sort_order drives
  -- /trending-discussions pagination, oldest-first.
  CREATE TABLE IF NOT EXISTS discussions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    comment_count INTEGER NOT NULL,
    movie_title TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );
`);

// Repairs rows written before sourceUrl became movie-specific (see
// services/discussionSources.ts): a bare or missing URL is replaced with a
// movie-specific search on a rotated platform. Idempotent — a no-op once
// nothing malformed remains.
db.exec(`
  UPDATE discussions
  SET source_url = CASE (ROWID % 3)
    WHEN 0 THEN 'https://letterboxd.com/search/' || REPLACE(movie_title, ' ', '%20') || '/'
    WHEN 1 THEN 'https://www.reddit.com/r/movies/search/?q=' || REPLACE(movie_title, ' ', '%20') || '&restrict_sr=1'
    ELSE 'https://www.rottentomatoes.com/search?search=' || REPLACE(movie_title, ' ', '%20')
  END
  WHERE source_url IS NULL OR TRIM(source_url) = '' OR source_url NOT LIKE 'http%';
`);
