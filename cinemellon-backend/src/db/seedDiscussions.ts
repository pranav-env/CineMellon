import { DiscussionThread } from "../types.js";
import { DISCUSSION_SOURCES } from "../services/discussionSources.js";

/**
 * Seeded once into the discussions table via `npm run seed`. Twelve entries
 * so /trending-discussions?page= can use ordinary offset pagination.
 *
 * sourceName/sourceUrl are derived below by rotating through
 * DISCUSSION_SOURCES, so every card links to a real, movie-specific search
 * rather than a bare homepage.
 */
const BASE: Array<Omit<DiscussionThread, "sourceName" | "sourceUrl">> = [
  {
    id: "d1",
    title: "The tesseract scene is Nolan's most literal metaphor yet",
    excerpt: "Revisiting how the five-dimensional library sequence turns an abstract physics idea into raw emotion.",
    commentCount: 342,
    movieTitle: "Interstellar",
  },
  {
    id: "d2",
    title: "Why the Joker's origin story was never meant to be answered",
    excerpt: "A closer look at how contradictory scar stories were written to deny the Joker any single truth.",
    commentCount: 891,
    movieTitle: "The Dark Knight",
  },
  {
    id: "d3",
    title: "Arrival's circular structure, five years later",
    excerpt: "How the film's non-linear editing quietly trains the audience to think like a heptapod.",
    commentCount: 156,
    movieTitle: "Arrival",
  },
  {
    id: "d4",
    title: "Does the top actually fall in Inception?",
    excerpt: "A frame-by-frame debate about the final wobble, and why Nolan says the ambiguity is the point.",
    commentCount: 1204,
    movieTitle: "Inception",
  },
  {
    id: "d5",
    title: "The corn fields were real, and it shows",
    excerpt: "Why shooting practical crops instead of CGI quietly changes how Interstellar's Earth scenes feel.",
    commentCount: 98,
    movieTitle: "Interstellar",
  },
  {
    id: "d6",
    title: "Heath Ledger's Joker voice, explained by a dialect coach",
    excerpt: "Breaking down the vocal choices behind the rasp, and how much of it was Ledger's own invention.",
    commentCount: 445,
    movieTitle: "The Dark Knight",
  },
  {
    id: "d7",
    title: "The heptapod logograms were hand-drawn, not generated",
    excerpt: "An interview thread on how each circular symbol was designed to have no true beginning or end.",
    commentCount: 212,
    movieTitle: "Arrival",
  },
  {
    id: "d8",
    title: "Ranking every 'we need to go deeper' meme, ten years on",
    excerpt: "A surprisingly thorough oral history of how one line of dialogue became shorthand for scope creep.",
    commentCount: 673,
    movieTitle: "Inception",
  },
  {
    id: "d9",
    title: "Two-Face's coin only had one 'good' side the whole time",
    excerpt: "A prop continuity thread that turned into a broader read on how the film foreshadows Harvey's fall.",
    commentCount: 331,
    movieTitle: "The Dark Knight",
  },
  {
    id: "d10",
    title: "Kip Thorne's black hole math ended up in a real physics paper",
    excerpt: "How Gargantua's rendering, built for accuracy rather than spectacle, fed back into actual research.",
    commentCount: 187,
    movieTitle: "Interstellar",
  },
  {
    id: "d11",
    title: "Is Louise's choice at the end actually hopeful?",
    excerpt: "A long-running argument over whether choosing a loss you can already see coming is comfort or tragedy.",
    commentCount: 264,
    movieTitle: "Arrival",
  },
  {
    id: "d12",
    title: "The hotel corridor fight, one shot at a time",
    excerpt: "A shot-by-shot breakdown of the rotating practical set and how the choreography tracked the rig's spin.",
    commentCount: 512,
    movieTitle: "Inception",
  },
];

export const seedDiscussions: DiscussionThread[] = BASE.map((item, i) => {
  const source = DISCUSSION_SOURCES[i % DISCUSSION_SOURCES.length];
  return {
    ...item,
    sourceName: source.name,
    sourceUrl: source.buildUrl(item.movieTitle),
  };
});
