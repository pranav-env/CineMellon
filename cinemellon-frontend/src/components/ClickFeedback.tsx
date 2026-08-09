import { useEffect } from "react";

const FEEDBACK_CLASS = "click-feedback";
const FEEDBACK_DURATION_MS = 400;

/**
 * Mounted once (see App.tsx). Uses event delegation at the document level
 * rather than per-button state, so every button gets the same "yes, that
 * registered" pulse — existing ones and any added later — with a single
 * point of implementation. See the .click-feedback keyframes in index.css.
 */
export default function ClickFeedback() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("button");
      if (!target || target.disabled) return;

      // Restart the animation even on rapid repeat clicks.
      target.classList.remove(FEEDBACK_CLASS);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      void target.offsetWidth; // force reflow so removing+re-adding the class actually restarts the animation
      target.classList.add(FEEDBACK_CLASS);

      setTimeout(() => target.classList.remove(FEEDBACK_CLASS), FEEDBACK_DURATION_MS);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
