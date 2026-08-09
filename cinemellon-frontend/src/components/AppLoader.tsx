import { AnimatePresence, motion } from "framer-motion";
import cinemellonMark from "@/assets/cinemellon-mark.svg";

interface AppLoaderProps {
  visible: boolean;
}

/**
 * Full-screen branded splash shown while the app prefetches its initial
 * data (see App.tsx). Trending Discussions' first page can involve a live
 * TMDB + AI round trip on a cold cache, so this gives that time to finish
 * before the person sees an empty section.
 */
export default function AppLoader({ visible }: AppLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-surface"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="flex items-center gap-1">
              <img src={cinemellonMark} alt="CineMellon®" className="h-14 w-auto sm:h-16" />
              <sup className="text-sm text-muted sm:text-base">®</sup>
            </span>
            <p className="font-display text-sm italic tracking-wide text-muted">One space to rule them all</p>
          </motion.div>
          <div className="h-[3px] w-40 overflow-hidden rounded-full bg-surface-line">
            <motion.div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-coral/20 to-coral"
              animate={{ x: ["-120%", "320%"] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
