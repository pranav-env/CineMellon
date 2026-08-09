import { randomUUID } from "node:crypto";
import { generateStructured } from "./ai/index.js";
import { getTrendingMovies } from "./tmdb.js";
import { getDiscussionsCount, appendDiscussions, getRecentDiscussionSignatures } from "../db/discussionsRepo.js";
import { getIntegrationStatus } from "../config.js";
import { DiscussionThread } from "../types.js";
import { DISCUSSION_SOURCES } from "./discussionSources.js";

/**
 * Generates forum-post-style discussion cards for real, currently-trending
 * movies (via TMDB's trending endpoint). Nothing is attributed to a real
 * person or claims to be an actual post — sourceName is a generic platform
 * tag, matching the spirit of the hand-written seed data.
 */

interface GeneratedDiscussion {
  movieTitle: string;
  title: string;
  excerpt: string;
  commentCount: number;
}

const batchSchema = {
  type: "object",
  properties: {
    discussions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          movieTitle: { type: "string" },
          title: { type: "string" },
          excerpt: { type: "string" },
          commentCount: { type: "integer" },
        },
        required: ["movieTitle", "title", "excerpt", "commentCount"],
      },
    },
  },
  required: ["discussions"],
} as const;

/** Case/whitespace-insensitive key for de-duplicating movie + talking-point
 * pairs. Catches exact and near-exact repeats, which is the common case
 * when the same trending list is fed back in across generation batches. */
function signatureOf(movieTitle: string, title: string): string {
  return `${movieTitle.trim().toLowerCase()}||${title.trim().toLowerCase()}`;
}

function buildPrompt(movieTitles: string[], count: number, alreadyCovered: string[]): string {
  const avoidSection =
    alreadyCovered.length > 0
      ? `\n\nThese talking points have already been used in previous batches — write about different specifics, don't reuse or lightly reword any of them:\n${alreadyCovered.map((t) => `- ${t}`).join("\n")}`
      : "";

  return `You're generating sample cards for Cinemellon, a movie exploration app's "Trending Discussions" feed — short, engaging talking points about currently popular films, in the style of a post title + excerpt from a film community.

Currently-trending films to draw from (spread across a genuine variety of these, not just one or two):
${movieTitles.map((t) => `- ${t}`).join("\n")}

Generate exactly ${count} discussion cards. For each one:
- movieTitle: must be one of the titles listed above, verbatim.
- title: a short, punchy line naming one specific, genuine talking point — a theory, a technical or creative choice, a performance, a callback, an ending debate. Not a generic "this movie is great."
- excerpt: 1-2 sentences expanding on that point, written like a thoughtful fan/critic post.
- commentCount: a plausible integer reply count for such a post (roughly 40-900).

Stay grounded in what's actually true about each film — don't invent plot specifics you're not confident about.${avoidSection}`;
}

let inFlight: Promise<void> | null = null;

async function generateAndAppend(batchSize: number): Promise<void> {
  const trending = await getTrendingMovies(20);
  if (trending.length === 0) return;

  // Feed already-covered talking points back into the prompt so the model
  // reaches for fresh angles instead of repeating a prior batch.
  const recent = getRecentDiscussionSignatures();
  const existingSignatures = new Set(recent.map((r) => signatureOf(r.movieTitle, r.title)));

  const prompt = buildPrompt(
    trending.map((m) => m.title),
    batchSize,
    recent.map((r) => `${r.movieTitle}: ${r.title}`)
  );
  const { data } = await generateStructured<{ discussions: GeneratedDiscussion[] }>(prompt, batchSchema);

  // Hard filter as a backstop to the prompt: drop anything that duplicates
  // an existing row or one earlier in this batch.
  const rows: DiscussionThread[] = [];
  data.discussions.forEach((d, i) => {
    const signature = signatureOf(d.movieTitle, d.title);
    if (existingSignatures.has(signature)) return;
    existingSignatures.add(signature);

    const source = DISCUSSION_SOURCES[i % DISCUSSION_SOURCES.length];
    rows.push({
      id: `gen-${randomUUID()}`,
      title: d.title,
      excerpt: d.excerpt,
      sourceName: source.name,
      sourceUrl: source.buildUrl(d.movieTitle),
      commentCount: Math.max(1, Math.round(d.commentCount)),
      movieTitle: d.movieTitle,
    });
  });

  if (rows.length > 0) appendDiscussions(rows);
}

/**
 * Tops the discussions cache up to at least `minCount` rows, generating a
 * fresh batch grounded in real TMDB trending movies. Safe to call on every
 * request — a no-op once enough rows are cached, a no-op if TMDB/AI aren't
 * configured, and concurrent calls share a single in-flight generation.
 */
export async function ensureDiscussionsAvailable(minCount: number, batchSize = 12): Promise<void> {
  if (getDiscussionsCount() >= minCount) return;

  const status = getIntegrationStatus();
  if (!status.tmdb || !status.aiAvailable) return;

  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      // Re-check inside the lock in case a concurrent request just finished.
      if (getDiscussionsCount() >= minCount) return;
      await generateAndAppend(batchSize);
    } catch (err) {
      // Log and let the route serve whatever's already cached.
      console.error("[discussions] generation failed, serving cached data instead:", err);
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
