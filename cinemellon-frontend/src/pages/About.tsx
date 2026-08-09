import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Mail, Linkedin, Github, Instagram } from "lucide-react";
import Reveal from "@/components/Reveal";
import cinemellonMark from "@/assets/cinemellon-mark.svg";
import pranavPhoto from "@/assets/team/pranav-bardiyar.jpg";
import arunishPhoto from "@/assets/team/arunish-choubey.jpg";

const TEAM = [
  {
    name: "Pranav Bardiyar",
    role: "Team Leader",
    photo: pranavPhoto,
    email: "bardiyarpranav@gmail.com",
    linkedin: "https://www.linkedin.com/in/pranavbardiyar",
    github: "https://github.com/pranav-env",
    instagram: "https://www.instagram.com/_pranav_env",
  },
  {
    name: "Arunish Choubey",
    role: null as string | null,
    photo: arunishPhoto,
    email: "choubeyarunish@gmail.com",
    linkedin: "https://www.linkedin.com/in/arunish-choubey-7b3136389",
    github: null as string | null,
    instagram: "https://www.instagram.com/arunishchoubey",
  },
];

function TeamCard({ member }: { member: (typeof TEAM)[number] }) {
  return (
    <div className="flex flex-col items-center rounded-xl2 border border-surface-line bg-surface-raised/40 p-6 text-center sm:p-8">
      <img
        src={member.photo}
        alt={member.name}
        className="h-28 w-28 rounded-xl2 border border-surface-line object-cover sm:h-32 sm:w-32"
      />
      <p className="mt-4 font-display text-lg">{member.name}</p>
      {member.role && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-coral">{member.role}</p>}
      <div className="mt-4 flex items-center gap-4">
        <a
          href={`mailto:${member.email}`}
          aria-label={`Email ${member.name}`}
          className="text-muted transition-colors hover:text-coral"
        >
          <Mail className="h-5 w-5" />
        </a>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="text-muted transition-colors hover:text-coral"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on GitHub`}
            className="text-muted transition-colors hover:text-coral"
          >
            <Github className="h-5 w-5" />
          </a>
        )}
        <a
          href={member.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on Instagram`}
          className="text-muted transition-colors hover:text-coral"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}

function NoteSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto mt-8 max-w-3xl border-t border-surface-line/40 pt-8 first:mt-0 first:border-t-0 first:pt-0">
      <h3 className="font-display text-lg text-bone">{title}</h3>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

export default function About() {
  return (
    <div className="pt-16 sm:pt-24">
      <div className="mx-auto max-w-5xl px-6 pb-24 2xl:max-w-[1200px]">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Reveal>
            <span className="flex items-center gap-1.5">
              <img src={cinemellonMark} alt="CineMellon®" className="h-20 w-auto sm:h-24" />
              <sup className="text-xl text-muted sm:text-2xl">®</sup>
            </span>
          </Reveal>

          <Reveal>
            <p className="mt-6 font-display text-2xl italic text-bone sm:text-3xl">One space to rule them all</p>
          </Reveal>

          <Reveal>
            <p className="mt-8 text-sm leading-relaxed text-muted sm:text-base">
              CineMellon® is an AI-powered movie exploration app — search, details, and AI-generated commentary in
              one place, built as an educational/portfolio project by Team Arsonists.
            </p>
          </Reveal>

          <Reveal>
            <p className="mt-8 text-sm leading-relaxed text-muted sm:text-base">
              The <strong className="font-semibold text-bone">Name</strong> carries a bit of world-building:{" "}
              <em className="text-bone not-italic">Cine</em> is short for cinema, and{" "}
              <em className="text-bone not-italic">Mellon</em> is Sindarin Elvish for friend — the word that opens
              the Doors of Durin in <em>The Fellowship of the Ring</em>. Put together, CineMellon is, plainly, a
              friend for movies.
            </p>
          </Reveal>

          <Reveal>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              The <strong className="font-semibold text-bone">Logo</strong> keeps the thread going: a filmstrip
              runs through the M for the medium itself, a small four-pointed star between the letters borrows from
              Elvish ornament, and the C's rounded arch is shaped like a hobbit's round door — three worlds folded
              into one crest.
            </p>
          </Reveal>

          <Reveal>
            <Link
              to="/legal?section=privacy"
              className="mt-8 text-sm font-medium text-coral transition-colors hover:text-clay"
            >
              Privacy Policy &amp; Terms
            </Link>
          </Reveal>
        </div>

        <Reveal amount={0.01}>
          <div className="mt-20">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-coral">Built by</p>
            <h2 className="mt-2 text-center font-display text-2xl text-bone sm:text-3xl">Team Arsonists</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted">
              CineMellon is built and maintained by a two-person team as part of an internship / portfolio
              submission — see the Concept Note below for the full project write-up.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {TEAM.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal amount={0.01}>
          <div className="mt-20 rounded-xl2 border border-surface-line bg-surface-raised/30 p-6 sm:p-10">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Internship submission</p>
              <h2 className="mt-2 font-display text-2xl text-bone sm:text-3xl">Concept Note</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Cinemellon — An AI-Powered Movie Exploration Platform. AICTE | IBM SkillsBuild Gen AI &amp; Cloud
                Computing Internship | BharatCares. Team Arsonists (Team ID: IBMBH12336), Birsa Institute of
                Technology Sindri.
              </p>
            </div>

            <NoteSection title="1. Project Title &amp; Application Name">
              <p>
                <strong className="text-bone">Project title:</strong> Cinemellon — An AI-Powered Movie Exploration
                Platform. <strong className="text-bone">Application name:</strong> Cinemellon, branded on-site as "A
                Parzival Product."
              </p>
              <p>
                Cinemellon is a full-stack web application for discovering and exploring films and TV series. It
                combines factual movie and show data with editorial content generated by a large language model
                (LLM) on request, alongside a curated feed of trending film discussion, and a personal Favourites
                list for saving titles. It was built as an internship project to demonstrate practical,
                production-style integration of generative AI into a real product, rather than as a commercial
                service.
              </p>
            </NoteSection>

            <NoteSection title="2. Problem Statement / Objective">
              <p>
                <strong className="text-bone">Problem.</strong> Standard movie databases are strong on structured
                facts — cast, crew, runtime, ratings — but thin on the narrative context that makes a film
                genuinely interesting: production trivia, a clear plot timeline, hidden details, character
                psychology, cinematographic choices, and cultural legacy. Writing that kind of editorial content by
                hand for every title doesn't scale. Meanwhile, the conversation around film — on Reddit, Letterboxd,
                and criticism outlets — is scattered across many separate platforms, with no single place to get a
                quick pulse on it.
              </p>
              <p>
                <strong className="text-bone">Objective.</strong> Build one fast, visually engaging application
                that:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Surfaces verified factual movie data alongside rich, AI-generated editorial analysis, produced on
                  demand rather than pre-written by hand
                </li>
                <li>
                  Presents that analysis in a structured, explorable way — including reveal-gated spoiler content —
                  instead of one long undifferentiated block of text
                </li>
                <li>Gives users a curated, single-place view of what's currently being discussed in film culture</li>
                <li>Lets users save titles to a personal Favourites list for later, without needing an account</li>
              </ul>
            </NoteSection>

            <NoteSection title="3. Target User &amp; Use Case">
              <p>
                <strong className="text-bone">Target users:</strong> movie and TV enthusiasts who want to go deeper
                than a synopsis or a star rating; casual viewers deciding what to watch, who want an engaging
                overview in one place; and students, trivia enthusiasts, and casual writers looking for
                well-organized facts and talking points about a specific title.
              </p>
              <p>
                <strong className="text-bone">Primary use case (typical flow):</strong> the user opens Cinemellon
                and uses the Movie / Series toggle in the Hero section to set what they're searching for, then
                starts typing a title. They either tap a match directly from the live dropdown, or hit the sparkle
                (Curate) button to open a dedicated, paginated search-results page listing every match.
              </p>
              <p>
                On the Details page, they see core facts sourced from TMDB (with OMDB as an automatic fallback for
                movies) or TVmaze (for series) — poster, genres, runtime, cast &amp; crew, and rating. For movies,
                they explore AI-generated sections — Trivia, Timeline, Hidden Details, Easter Eggs, Character
                Analysis, Cinematography, Sound &amp; Music, Awards, Reception, and Legacy — generated (and cached)
                specifically for that title; series currently show core info and cast only. If they want the ending
                discussed, they explicitly tap "Reveal Spoilers" to unlock the Ending Explained section.
              </p>
              <p>
                From there they can save the title to their Favourites with one tap, follow AI-suggested Similar
                Movies to keep exploring, or check Trending Discussions for curated conversation-starters linking
                out to film publications.
              </p>
            </NoteSection>

            <NoteSection title="4. LLM Model &amp; API Used">
              <p>
                The backend is provider-agnostic by design and supports either of two LLM providers, chosen by
                configuration rather than hard-coded into the application logic: Anthropic (default model
                claude-sonnet-5, via the Anthropic Messages API with forced tool-use for structured output) or
                Google (default model gemini-3.1-flash-lite, via the Gemini API with a response schema and JSON
                MIME type). Both model names are overridable via environment variables (ANTHROPIC_MODEL,
                GEMINI_MODEL). The active provider is chosen by an explicit AI_PROVIDER setting, or automatically —
                preferring Anthropic if its key is present, falling back to Gemini otherwise.
              </p>
              <p>
                <strong className="text-bone">How it's used:</strong> on a movie's first lookup, one structured
                prompt asks the model to generate the entire editorial dossier at once (summary, trivia, timeline,
                character analysis, cinematography, sound &amp; music, awards, reception, legacy, and
                similar-movie suggestions) — the result is cached, so it's generated only once per film. A separate,
                lighter prompt regenerates a single section (Trivia, Timeline, Hidden Details, Easter Eggs, or
                Quotes) on demand, explicitly instructed to return a genuinely different set of items rather than a
                rephrasing. Both providers are forced into schema-valid JSON output instead of parsing free-form
                text — a deliberate reliability choice — and prompts explicitly instruct the model to prefer a
                general statement over inventing a precise-sounding but unverified fact, as a concrete mitigation
                against hallucinated specifics.
              </p>
              <p>
                <strong className="text-bone">Supporting data APIs:</strong> factual data for movies is sourced
                from TMDB (The Movie Database), with OMDB (Open Movie Database) as an automatic fallback if a TMDB
                lookup fails. TV series are served separately through TVmaze, which supplies core show details and
                cast; the deeper AI-generated sections are currently generated for movies only. All three are
                non-LLM data APIs that ground the page in real, verifiable facts before the AI layer adds editorial
                depth on top of it.
              </p>
            </NoteSection>

            <NoteSection title="5. Key Features of the Application">
              <p>
                <strong className="text-bone">Discovery &amp; Browsing:</strong> a Movie / Series toggle in the
                Hero section switches the whole search experience between TMDB+OMDB-backed movies and
                TVmaze-backed series; live search-as-you-type; automatic OMDB fallback for movies; homepage
                quick-access picks; a Trending Discussions feed with pagination and outbound links; and a personal
                Favourites page — save any title with one tap from its details page, browse and manage saved
                movies and series from a dedicated, paginated Favourites view.
              </p>
              <p>
                <strong className="text-bone">AI-Generated Movie Intelligence:</strong> spoiler-free summary
                alongside a full, separately-gated Ending Explained breakdown; trivia, production timeline, hidden
                details, and easter eggs with one-click regeneration for fresh trivia; deep character analysis;
                cinematography and sound &amp; music breakdowns; iconic quotes, awards &amp; recognition, critical
                reception, and cultural legacy; and AI-suggested Similar Movies, automatically resolved to real,
                clickable catalog entries. All of the above is generated for movies — TV series currently show core
                show details and cast only.
              </p>
              <p>
                <strong className="text-bone">Engineering highlights:</strong> server-side caching (SQLite) so each
                film's AI dossier is generated once and reused instantly on every later visit; a resilient outbound
                HTTP layer with automatic retries, backoff, and timeouts for every third-party call; a dual-provider
                AI architecture sharing one schema so the two providers' output stays directly comparable and
                swappable; and a React Query-driven frontend (React 19 + TypeScript + Tailwind) with Framer Motion /
                GSAP animation and a WebGL background layer.
              </p>
            </NoteSection>

            <NoteSection title="6. Expected User Experience &amp; Outcomes">
              <p>
                Cinemellon is designed to feel fast, cinematic, and editorial rather than database-like — a dark,
                coral-accented theme with smooth reveal animations sets the tone, while the underlying data loads
                quickly thanks to server-side caching. Spoiler management is deliberate: a safe, spoiler-free
                summary is always visible first, with major reveals sitting behind an explicit "Reveal Spoilers"
                action rather than being shown by default.
              </p>
              <p>
                <strong className="text-bone">Outcomes for the user:</strong> leaves with a genuinely deeper
                understanding of a film than a standard database entry provides; can browse safely without ending
                spoilers being forced on them; and is naturally guided into a loop of searching, exploring in
                depth, saving favourites, discovering similar titles, and repeating.
              </p>
              <p>
                <strong className="text-bone">Outcomes for this internship / portfolio submission:</strong> built
                end-to-end through vibe coding with Claude handling the coding, after initial planning and ideation
                with ChatGPT; demonstrates practical multi-provider LLM integration using structured output /
                function-calling rather than fragile text parsing; demonstrates deliberate prompt engineering,
                including concrete hallucination mitigation and spoiler-safe content design; and demonstrates
                independently managing deployment end to end, with the backend and frontend manually hosted on
                separate platforms.
              </p>
            </NoteSection>

            <NoteSection title="Appendix — Technology Stack at a Glance">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">Frontend</p>
                  <p className="mt-1">
                    React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Framer Motion, GSAP, OGL
                    (WebGL)
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">Backend</p>
                  <p className="mt-1">Node.js, Express, TypeScript, better-sqlite3</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">Data sources</p>
                  <p className="mt-1">
                    TMDB &amp; OMDB APIs (movies, with OMDB as fallback); TVmaze API (TV series &amp; cast);
                    Anthropic Claude API and/or Google Gemini API (AI-generated editorial content for movies)
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">Hosting</p>
                  <p className="mt-1">Backend deployed manually on Render; frontend deployed manually on Vercel</p>
                </div>
              </div>
            </NoteSection>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
