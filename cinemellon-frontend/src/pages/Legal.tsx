import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Reveal from "@/components/Reveal";
import privacyPolicyMd from "@/content/privacy-policy.md?raw";
import termsConditionsMd from "@/content/terms-and-conditions.md?raw";

type LegalSection = "privacy" | "terms";

export default function Legal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section: LegalSection = searchParams.get("section") === "terms" ? "terms" : "privacy";

  function selectSection(next: LegalSection) {
    setSearchParams({ section: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pt-10">
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Legal</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Privacy &amp; Terms</h1>
        </Reveal>

        <div
          className="mt-6 inline-flex items-center rounded-xl2 border border-surface-line bg-surface-raised/60 p-1"
          role="tablist"
          aria-label="Privacy Policy or Terms & Conditions"
        >
          {(["privacy", "terms"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={section === s}
              onClick={() => selectSection(s)}
              className={`rounded-xl2 px-5 py-1.5 text-sm font-medium transition-colors ${
                section === s ? "bg-coral text-ink" : "text-muted hover:text-bone"
              }`}
            >
              {s === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
            </button>
          ))}
        </div>

        <article className="prose prose-sm sm:prose-base mt-10 border-t border-surface-line pt-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              // Markdown tables render as plain <table> with no built-in
              // reflow — on a narrow screen the Privacy Policy's 4-column
              // services table would otherwise force horizontal overflow
              // on the whole page rather than just scrolling within itself.
              table: ({ children }) => (
                <div className="overflow-x-auto">
                  <table>{children}</table>
                </div>
              ),
            }}
          >
            {section === "privacy" ? privacyPolicyMd : termsConditionsMd}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
