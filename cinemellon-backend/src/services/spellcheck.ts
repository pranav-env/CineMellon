import { generateStructured } from "./ai/index.js";

export interface SpellcheckResult {
  hasTypo: boolean;
  corrected: string;
}

const schema = {
  type: "object",
  properties: {
    hasTypo: { type: "boolean" },
    corrected: { type: "string" },
  },
  required: ["hasTypo", "corrected"],
} as const;

function buildPrompt(query: string, label: string): string {
  return `Someone searched for "${query}" looking for a ${label}, and got zero results.

Is "${query}" very likely a simple spelling mistake (typo, missing/swapped/doubled letters, etc.) for the title of a real, well-known ${label}? Only say yes if you're genuinely confident what they meant — don't guess wildly at an obscure or unrelated title just because something is technically possible.

If yes: hasTypo true, corrected set to the real title's correct spelling.
If no (already correct but genuinely has no match, too ambiguous, or not a real title at all): hasTypo false, corrected as an empty string.`;
}

/**
 * Used by the search-results page specifically, only when a search comes
 * back with zero results — not on every keystroke in the dropdown, which
 * would add AI latency to ordinary searches that already work fine.
 */
export async function checkForTypo(query: string, mediaType: "movie" | "series"): Promise<SpellcheckResult> {
  const label = mediaType === "movie" ? "movie" : "TV series";
  const { data } = await generateStructured<SpellcheckResult>(buildPrompt(query, label), schema);
  return data;
}
