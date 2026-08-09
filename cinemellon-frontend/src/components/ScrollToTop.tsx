import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position between route changes, so
 * navigating from partway down a long page leaves the new page at the same
 * offset. useLayoutEffect (not useEffect) runs before paint, avoiding a
 * visible flash and preventing Reveal.tsx's whileInView animations from
 * measuring against the wrong scroll position on mount.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
