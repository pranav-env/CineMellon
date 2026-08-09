interface FilmStripEdgeProps {
  side: "left" | "right";
  holeCount?: number;
}

/**
 * Sprocket-hole film-strip pattern built from real DOM + CSS rather than an
 * SVG image, so it can fade to transparent via gradient and pick up the
 * site's own color tokens instead of being a fixed, separately-colored
 * asset.
 *
 * Hidden below the `sm` breakpoint, where it would eat into already-tight
 * card padding for a decorative flourish that isn't worth the space there.
 */
export default function FilmStripEdge({ side, holeCount = 11 }: FilmStripEdgeProps) {
  const holes = Array.from({ length: holeCount });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 z-[5] hidden w-7 flex-col items-center justify-between py-6 sm:flex sm:w-9 sm:py-8 ${
        side === "left"
          ? "left-0 border-r border-coral/15 bg-gradient-to-r from-black/85 via-black/70 to-transparent"
          : "right-0 border-l border-coral/15 bg-gradient-to-l from-black/85 via-black/70 to-transparent"
      }`}
    >
      {holes.map((_, i) => (
        <div
          key={i}
          className="aspect-square w-[55%] rounded-[4px] border border-white/10 bg-surface-raised shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]"
        />
      ))}
    </div>
  );
}
