import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import cinemellonLogo from "@/assets/cinemellon-logo.svg";

// Desktop order is Trending / Home / Favourites, with Home anchoring the
// centre — different from the mobile menu below, which lists all four in
// conventional order.
const CENTER_LINKS = [
  { to: "/trending", label: "Trending", end: false },
  { to: "/", label: "Home", end: true },
  { to: "/favourites", label: "Favourites", end: false },
];

const MOBILE_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/trending", label: "Trending", end: false },
  { to: "/favourites", label: "Favourites", end: false },
  { to: "/about", label: "About us", end: false },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Active links get a solid background rather than just a text-colour
  // change; padding stays constant so nothing shifts when it toggles.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl2 px-4 py-1.5 text-base font-medium transition-colors ${
      isActive ? "bg-coral text-ink" : "text-muted hover:text-bone"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl2 px-4 py-3 text-center text-base font-medium transition-colors ${
      isActive ? "bg-coral text-ink" : "text-muted hover:text-bone"
    }`;

  const aboutClass = ({ isActive }: { isActive: boolean }) =>
    `hidden shrink-0 rounded-xl2 px-5 py-2.5 text-sm font-semibold text-ink transition-colors md:inline-flex ${
      isActive ? "bg-clay" : "bg-coral hover:bg-clay"
    }`;

  const favouritesClass = ({ isActive }: { isActive: boolean }) =>
    `flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2 border transition-colors md:hidden ${
      isActive ? "border-coral bg-coral/10 text-coral" : "border-surface-line text-muted hover:border-coral/50 hover:text-coral"
    }`;

  // Always visible in the top half of the viewport. Below that, hides on
  // scroll-down and reappears instantly on scroll-up.
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      const threshold = window.innerHeight / 2;

      if (currentY <= threshold) {
        setHidden(false);
      } else if (currentY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on an outside click, Escape, or if the viewport
  // crosses into the desktop layout while it's open.
  useEffect(() => {
    if (!mobileOpen) return;

    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    function handleViewportChange() {
      if (desktopQuery.matches) setMobileOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    desktopQuery.addEventListener("change", handleViewportChange);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
      desktopQuery.removeEventListener("change", handleViewportChange);
    };
  }, [mobileOpen]);

  // Stay visible while the mobile menu is open, regardless of scroll.
  const showNav = !hidden || mobileOpen;

  return (
    <motion.header
      ref={headerRef}
      animate={{ y: showNav ? "0%" : "-100%" }}
      transition={{ duration: showNav ? 0.15 : 0.3, ease: "easeInOut" }}
      // Translucent + blurred, no border — reads as glass over the page.
      className="fixed inset-x-0 top-0 z-40 bg-surface/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6 md:grid md:grid-cols-[auto_1fr_auto] 2xl:max-w-[1400px]">
        <Link to="/" className="flex shrink-0 items-center gap-1.5">
          <img src={cinemellonLogo} alt="CineMellon®" className="h-9 w-auto sm:h-10" />
          <sup className="text-sm text-muted">®</sup>
        </Link>

        {/* Desktop-only centred link group, boxed so it reads as a distinct
            cluster. Hidden entirely (not just collapsed) on mobile so it
            doesn't interfere with the flex layout below. */}
        <div className="hidden justify-center md:flex">
          <div className="flex items-center gap-4 rounded-xl2 border border-surface-line px-4 py-2">
            {CENTER_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <NavLink to="/favourites" end aria-label="Favourites" className={favouritesClass}>
            {({ isActive }) => <Heart className={`h-5 w-5 ${isActive ? "fill-coral" : ""}`} />}
          </NavLink>
          <NavLink to="/about" className={aboutClass}>
            About us
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-xl2 border border-surface-line text-bone transition-colors hover:border-coral/50 hover:text-coral md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-surface-line md:hidden"
          >
            {/* Centre-aligned per spec — items-center on the column plus
                text-center + full-width links inside mobileLinkClass. */}
            <div className="flex flex-col items-center gap-1 px-4 py-3 sm:px-6">
              {MOBILE_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
