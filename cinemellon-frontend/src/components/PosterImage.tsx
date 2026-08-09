import { useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * Drop-in replacement for a plain <img> poster tag. Falls back to a themed
 * message instead of the browser's default broken-image icon when the URL
 * 404s or otherwise fails to load. className is applied to whichever of the
 * two (image or fallback) actually renders, so callers don't need to know
 * which one they got — sizing/aspect-ratio classes land the same either way.
 */
export default function PosterImage({
  src,
  alt,
  className = "",
  compact = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  /** Icon-only fallback with no text, for thumbnail-sized contexts (search
   * dropdown, season list) too small to fit the full message legibly. */
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (compact) {
      return (
        <div className={`flex items-center justify-center bg-surface-raised ${className}`}>
          <ImageOff className="h-3.5 w-3.5 text-faint" />
        </div>
      );
    }
    return (
      <div
        className={`flex aspect-[2/3] flex-col items-center justify-center gap-1.5 bg-surface-raised px-4 text-center ${className}`}
      >
        <p className="font-display text-sm italic leading-snug text-muted">The Missing Palantír</p>
        <p className="text-xs leading-snug text-faint">This poster has been lost in the Middle-earth</p>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
