import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface text-bone font-body">
      <Navbar />
      {/* Navbar is `fixed` (so it can slide off-screen on scroll) rather than
          `sticky`, so this spacer reserves the space it used to occupy
          in-flow. Height matches the navbar's rendered height plus a small
          safety margin. */}
      <div className="h-[84px] shrink-0" aria-hidden="true" />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          {/* Opacity only — no transform. A transform here would create a
              new containing block for position:fixed descendants inside
              <Outlet /> (e.g. CardNav's mobile drawer), causing them to
              position relative to this div instead of the viewport during
              the transition. */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
