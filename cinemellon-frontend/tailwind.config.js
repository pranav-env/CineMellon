/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // rgb(var(...) / <alpha-value>) is the standard Tailwind pattern for
        // CSS-variable-driven theming that still supports opacity modifiers
        // (bg-coral/10, border-surface-line/60, etc — already used across
        // the app). The variables themselves live in index.css: a dark set
        // on :root, overridden by a light set under html.light.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised) / <alpha-value>)",
        "surface-line": "rgb(var(--color-surface-line) / <alpha-value>)",
        coral: "rgb(var(--color-coral) / <alpha-value>)",
        clay: "rgb(var(--color-clay) / <alpha-value>)",
        bone: "rgb(var(--color-bone) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        faint: "rgb(var(--color-faint) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "coral-glow": "linear-gradient(135deg, #2A1414 0%, #7A2A22 45%, #FF6B6B 100%)",
        "coral-cta": "linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 0 40px rgba(255,107,107,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#FFFFFF",
            "--tw-prose-headings": "#FFFFFF",
            "--tw-prose-lead": "#A6A6AA",
            "--tw-prose-links": "#FF6B6B",
            "--tw-prose-bold": "#FFFFFF",
            "--tw-prose-counters": "#A6A6AA",
            "--tw-prose-bullets": "#6E6E73",
            "--tw-prose-hr": "#2A2A2A",
            "--tw-prose-quotes": "#FFFFFF",
            "--tw-prose-quote-borders": "#FF6B6B",
            "--tw-prose-captions": "#A6A6AA",
            "--tw-prose-code": "#FFFFFF",
            "--tw-prose-pre-code": "#FFFFFF",
            "--tw-prose-pre-bg": "#191919",
            "--tw-prose-th-borders": "#2A2A2A",
            "--tw-prose-td-borders": "#2A2A2A",
            maxWidth: "none",
            a: { textDecoration: "none", fontWeight: "500" },
            "a:hover": { color: "#FF8E72" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
