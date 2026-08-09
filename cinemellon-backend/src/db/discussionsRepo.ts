import { db } from "./index.js";
import { DiscussionThread } from "../types.js";

const countStmt = db.prepare(`SELECT COUNT(*) as n FROM discussions`);
const maxSortOrderStmt = db.prepare(`SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM discussions`);
const pageStmt = db.prepare(`
  SELECT id, title, excerpt, source_name as sourceName, source_url as sourceUrl,
         comment_count as commentCount, movie_title as movieTitle
  FROM discussions
  ORDER BY sort_order ASC
  LIMIT @limit OFFSET @offset
`);
const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO discussions
    (id, title, excerpt, source_name, source_url, comment_count, movie_title, sort_order)
  VALUES
    (@id, @title, @excerpt, @sourceName, @sourceUrl, @commentCount, @movieTitle, @sortOrder)
`);
// Most-recent-first, capped — enough context for the generator to avoid
// repeating itself without growing the prompt unbounded over time.
const recentSignaturesStmt = db.prepare(`
  SELECT movie_title as movieTitle, title
  FROM discussions
  ORDER BY sort_order DESC
  LIMIT @limit
`);

export const PAGE_SIZE = 4;

/**
 * Standard offset pagination — page 0 is items 0..3, page 1 is 4..7, etc.
 * An empty array past the end signals the frontend to stop offering "Load
 * More" (see useTrendingDiscussions). In practice discussionsGenerator.ts
 * keeps the table topped up before that point is reached, whenever TMDB
 * and an AI provider are configured.
 */
export function getDiscussionsPage(page: number): DiscussionThread[] {
  const offset = Math.max(0, page) * PAGE_SIZE;
  return pageStmt.all({ limit: PAGE_SIZE, offset }) as DiscussionThread[];
}

export function getDiscussionsCount(): number {
  return (countStmt.get() as { n: number }).n;
}

/** Recent movie_title/title pairs, newest first — used by
 * discussionsGenerator.ts both to tell the AI what's already been covered
 * (so it naturally reaches for new angles) and to hard-filter out any
 * generated row that would duplicate one of these, regardless of whether
 * the AI honored that instruction. */
export function getRecentDiscussionSignatures(limit = 60): { movieTitle: string; title: string }[] {
  return recentSignaturesStmt.all({ limit }) as { movieTitle: string; title: string }[];
}

/** Appends freshly-generated rows after whatever's already cached,
 * continuing the existing sort_order sequence so pagination stays stable
 * and nothing already-served ever shifts or repeats. */
export function appendDiscussions(rows: DiscussionThread[]): void {
  const startOrder = (maxSortOrderStmt.get() as { maxOrder: number }).maxOrder + 1;
  const insertAll = db.transaction((items: DiscussionThread[]) => {
    items.forEach((row, i) => insertStmt.run({ ...row, sortOrder: startOrder + i }));
  });
  insertAll(rows);
}
