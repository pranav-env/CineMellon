/**
 * Shared source-platform definitions for Trending Discussions, used by both
 * the AI generator (discussionsGenerator.ts) and the seed data
 * (db/seedDiscussions.ts). Discussion content is synthetic — see the Terms
 * & Conditions, Section 5 — so each sourceUrl links to a movie-specific
 * search on the platform rather than a fabricated article.
 */
export interface DiscussionSource {
  name: string;
  buildUrl: (movieTitle: string) => string;
}

export const DISCUSSION_SOURCES: DiscussionSource[] = [
  {
    name: "Letterboxd",
    buildUrl: (movieTitle) => `https://letterboxd.com/search/${encodeURIComponent(movieTitle)}/`,
  },
  {
    name: "Reddit r/movies",
    buildUrl: (movieTitle) =>
      `https://www.reddit.com/r/movies/search/?q=${encodeURIComponent(movieTitle)}&restrict_sr=1`,
  },
  {
    name: "Rotten Tomatoes",
    buildUrl: (movieTitle) => `https://www.rottentomatoes.com/search?search=${encodeURIComponent(movieTitle)}`,
  },
];
