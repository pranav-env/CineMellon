import { useEffect, useState } from "react";

const QUOTE = "I would have gone with you to the end, into the very fires of Mordor.";
const ATTRIBUTION = `ARAGORN, SON OF ARATHORN
Heir of Isildur
The rightful King of Gondor
Bearer of the Flame of the West
Wielder of Andúril, Flame of the West
Captain of the Dúnedain, Ranger of the North
The guy who spent years wandering around looking homeless despite literally being royalty`;
const QUOTE_TYPE_SPEED_MS = 45;
// Attribution is much longer than the quote, so it types faster — otherwise
// the whole sequence would run well past a typical loading window.
const ATTRIBUTION_TYPE_SPEED_MS = 15;

/**
 * Fills the sidebar-nav column with something to look at while the real
 * content loads, since that column (section navigation) doesn't exist yet
 * during loading and would otherwise sit blank next to the skeleton
 * blocks. Desktop only — that column doesn't exist below `lg:`.
 */
export default function TypewriterQuote() {
  const [quoteCount, setQuoteCount] = useState(0);
  const [attributionCount, setAttributionCount] = useState(0);
  const quoteDone = quoteCount >= QUOTE.length;
  const attributionDone = attributionCount >= ATTRIBUTION.length;

  // Phase 1: type the quote.
  useEffect(() => {
    if (quoteDone) return;
    const t = setTimeout(() => setQuoteCount((c) => c + 1), QUOTE_TYPE_SPEED_MS);
    return () => clearTimeout(t);
  }, [quoteCount, quoteDone]);

  // Phase 2: once the quote has fully typed, type the attribution.
  useEffect(() => {
    if (!quoteDone || attributionDone) return;
    const t = setTimeout(() => setAttributionCount((c) => c + 1), ATTRIBUTION_TYPE_SPEED_MS);
    return () => clearTimeout(t);
  }, [quoteDone, attributionCount, attributionDone]);

  return (
    <div className="hidden lg:block">
      <p className="font-display text-base italic leading-relaxed text-muted">
        &ldquo;{QUOTE.slice(0, quoteCount)}
        {!quoteDone ? <span className="animate-pulse text-coral">|</span> : "\u201d"}
      </p>
      {quoteDone && (
        <p className="mt-3 whitespace-pre-line text-right text-xs font-bold leading-relaxed text-faint">
          — {ATTRIBUTION.slice(0, attributionCount)}
          {!attributionDone && <span className="animate-pulse text-coral">|</span>}
        </p>
      )}
    </div>
  );
}
