import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Linkedin, ArrowUp } from "lucide-react";
import cinemellonMark from "@/assets/cinemellon-mark.svg";

const LINKEDIN_URL = "https://www.linkedin.com/in/pranavbardiyar";

const linkClass = "text-faint transition-colors hover:text-bone";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative border-t border-surface-line/60 py-12"
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl2 border border-surface-line text-muted transition-colors hover:border-coral/50 hover:text-coral"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:flex-row sm:items-start sm:justify-between 2xl:max-w-[1400px]">
        <div className="flex flex-col items-start text-left">
          <img src={cinemellonMark} alt="CineMellon®" className="h-9 w-auto" />
          <p className="mt-3 text-sm text-faint">CineMellon® 2026</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-14">
          <div className="text-left sm:ml-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Sitemap</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className={linkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/trending" className={linkClass}>
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/favourites" className={linkClass}>
                  Favourites
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  About us
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Contact us</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="mailto:cinemellon.org@gmail.com" className={`flex items-center gap-1.5 ${linkClass}`}>
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="break-all">cinemellon.org@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 ${linkClass}`}
                >
                  <Linkedin className="h-3.5 w-3.5 shrink-0" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Privacy and Terms</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/legal?section=privacy" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal?section=terms" className={linkClass}>
                  Terms &amp; Condition
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
