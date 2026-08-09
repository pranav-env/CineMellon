# Privacy Policy — CineMellon®

**Last updated:** July 23, 2026

> **Educational project notice.** CineMellon® is a non-commercial project built by a two-person student team ("**Team Arsonists**") as part of an internship / portfolio submission. It is not operated by a registered company. This policy is written to accurately describe what the CineMellon® code actually does — not a generic legal template — but it is **not a substitute for advice from a qualified lawyer**, especially if this project is ever turned into a commercial product or starts handling real user accounts or payments.

## Table of Contents

1. [Overview](#1-overview)
2. [Who Operates This Site](#2-who-operates-this-site)
3. [Information We Do NOT Collect](#3-information-we-do-not-collect)
4. [Information We Do Collect](#4-information-we-do-collect)
5. [Cookies & Similar Technologies](#5-cookies--similar-technologies)
6. [Third-Party Services We Use](#6-third-party-services-we-use)
7. [Links to Other Websites](#7-links-to-other-websites)
8. [How We Use Information](#8-how-we-use-information)
9. [Data Sharing](#9-data-sharing)
10. [Data Retention](#10-data-retention)
11. [Data Security](#11-data-security)
12. [Children's Privacy](#12-childrens-privacy)
13. [Your Rights & Choices](#13-your-rights--choices)
14. [International Users](#14-international-users)
15. [Changes to This Policy](#15-changes-to-this-policy)
16. [Contact Us](#16-contact-us)

---

## 1. Overview

CineMellon® is an AI-powered movie and TV series exploration app. You can search for movies and series, read AI-generated commentary about movies (trivia, timelines, hidden details, easter eggs, quotes), browse a curated "Trending Discussions" feed that links out to film-related publications, and save titles to a personal Favourites list.

**In short: CineMellon® does not require an account, does not use a login of any kind, and does not knowingly collect personal information about you beyond the limited, mostly automatic technical data described in Section 4.** There are no forms to fill in anywhere on the site other than an email link to contact the team directly. The one piece of data the site does keep is your Favourites list, and that's stored only in your own browser — see Section 4d.

## 2. Who Operates This Site

CineMellon® is built and operated by **Team Arsonists**, a two-person student team, as an educational/internship project.

**Contact:** [cinemellon.org@gmail.com](mailto:cinemellon.org@gmail.com)

## 3. Information We Do NOT Collect

To be explicit about what this site does **not** do:

- No user accounts, sign-up, login, or passwords
- No payment or billing information — the site is free and has no commerce features
- No forms that ask for your name, phone number, or address
- No advertising or ad-targeting of any kind
- No analytics or tracking scripts (no Google Analytics, Meta Pixel, Hotjar, Mixpanel, Sentry, or similar tools) are built into the code
- No selling of data — there is no data to sell

## 4. Information We Do Collect

### a) If you email us
If you use the contact link to email [cinemellon.org@gmail.com](mailto:cinemellon.org@gmail.com), we will naturally see your email address and whatever you write to us. We use this only to read and respond to your message, and we don't add you to any list or use it for anything else.

### b) Standard technical/server logs
Like virtually every website, when your browser loads CineMellon® or talks to its backend, our hosting provider(s) (Vercel and/or AWS, depending on where this instance is deployed — see Section 6) automatically process standard connection information as part of normal web infrastructure. This typically includes your IP address, browser/device type (user agent), the page or API endpoint requested, and timestamps. This is infrastructure-level logging used for things like debugging, security, and basic traffic monitoring — it is not compiled into a profile about you, and CineMellon®'s own code does not read or store this data.

### c) What you search for or click on
When you type a search query or open a movie or series page, that request (including the search text and the title you selected) is sent to the CineMellon® backend so it can return results. For movies outside the four hand-curated titles built into the app, this request may in turn be passed to TMDB (or OMDB, as an automatic fallback) for factual data, and to an AI provider (Anthropic and/or Google) purely to assemble the commentary shown on the page. Series pages are served from TVmaze instead. See Section 6 for all of these. This is about **the title you're looking up**, not about you personally; no name, account ID, or persistent visitor identifier is attached to these requests by CineMellon®'s own code.

### d) Your Favourites list
If you tap the heart / "Add to Favourites" button on a movie or series page, CineMellon® saves that title (its ID, name, poster, and a couple of display details) directly in your browser's `localStorage`, so it's there the next time you open the Favourites page. **This data never leaves your device** — it is not sent to our backend, not synced anywhere, and not visible to us in any form. It's tied to that specific browser on that specific device: it won't follow you to a different browser or a different device, and clearing your browser's site data for CineMellon® (or using a different browser/device) removes it. See Section 13 for how to clear it.

## 5. Cookies & Similar Technologies

**CineMellon®'s own code does not set any cookies, and does not use `sessionStorage`.** It does use `localStorage`, but only for one thing: your Favourites list (Section 4d). That's a save-it-for-later mechanism you control by tapping a heart icon, not a tracking technology — it identifies a title you saved, not you as a visitor, and nothing about it is ever transmitted anywhere.

Two caveats worth being transparent about:

- **Google Fonts:** this site loads its typefaces (Playfair Display and Inter) directly from Google's font servers (`fonts.googleapis.com` / `fonts.gstatic.com`). Per Google's own documentation, this does **not** set cookies, but — as with any direct request to a third-party server — it does cause your browser to send your IP address and user-agent string to Google as part of the standard HTTP request. See [Google Fonts' privacy FAQ](https://developers.google.com/fonts/faq/privacy) and [Google's Privacy Policy](https://policies.google.com/privacy).
- **Hosting infrastructure:** depending on how this project is deployed and configured (for example, load-balancer session stickiness on AWS, or edge features on Vercel), the hosting platform itself may set minimal technical cookies unrelated to anything in CineMellon®'s own code. These would be governed by the hosting provider's own policy, not by CineMellon®.

## 6. Third-Party Services We Use

CineMellon®'s backend calls a small number of third-party services to do its job. None of these receive your name, email, or any account identifier from CineMellon® — only movie titles, search text, and (inherently, as part of any internet request) your IP address.

| Service | What it's used for | What's sent | Their policy |
|---|---|---|---|
| **TMDB** (The Movie Database) | Movie facts (cast, crew, genres, runtime) and poster/backdrop images | Movie search terms / TMDB IDs. Poster images are loaded directly from TMDB's image servers by your browser. | [Terms of Use](https://www.themoviedb.org/terms-of-use) · [API Terms](https://www.themoviedb.org/api-terms-of-use) |
| **OMDB** (Open Movie Database) | Automatic fallback for movie facts if a TMDB lookup fails | Movie search terms. | [omdbapi.com](https://www.omdbapi.com/) |
| **TVmaze** | Series facts, cast, and poster/artwork images | Series search terms / TVmaze IDs. Images are loaded directly from TVmaze's servers by your browser. | [Privacy Policy](https://www.tvmaze.com/site/privacy) |
| **Anthropic (Claude API)** | Generating movie commentary — trivia, timelines, hidden details, easter eggs, quotes | Movie titles and section requested (e.g. "trivia"). No visitor personal data. | [Privacy Policy](https://www.anthropic.com/legal/privacy) |
| **Google (Gemini API)** | Same as above — alternate AI provider | Movie titles and section requested. No visitor personal data. | [Gemini API Terms](https://ai.google.dev/gemini-api/terms) · [Privacy Policy](https://policies.google.com/privacy) |
| **Google Fonts** | Typefaces (Playfair Display, Inter) | Your IP address and user agent, per standard font-loading requests (no cookies — see Section 5) | [Fonts Privacy FAQ](https://developers.google.com/fonts/faq/privacy) |
| **Vercel and/or AWS** | Hosting the site and/or backend | Standard connection/server logs (see Section 4b) | [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy) · [AWS Privacy Notice](https://aws.amazon.com/privacy/) |

Only the AI provider that is actually configured with an API key on the backend is used at any given time — see the project's own README for details on how that's selected.

## 7. Links to Other Websites

The "Trending Discussions" page links out to third-party sites (for example Reddit, Letterboxd, and various film publications) that CineMellon® does not own or control. These links open in a new tab. Once you leave CineMellon®, that site's own privacy policy applies — we're not responsible for their content or practices. Note that the discussion cards themselves are curated/illustrative content built for this demo rather than a live feed, and are not necessarily sourced verbatim from the linked publications.

## 8. How We Use Information

Whatever limited information described above does flow through the system is used only to:

- Operate and maintain the site
- Generate and return the movie content you actually asked for
- Respond to any email you send us
- Keep the site secure and debug problems

We do not use it for advertising, profiling, or marketing emails, and we do not sell it.

## 9. Data Sharing

We don't sell or rent personal information. The only "sharing" that happens is the third-party API calls described in Section 6, which are necessary for the app to function, plus disclosure if required by law.

## 10. Data Retention

- Assembled movie data (facts from TMDB/OMDB + AI-generated commentary) is cached server-side so repeat lookups are fast. This is content about movies, not about visitors, and may be retained indefinitely as part of the app's dataset.
- Your Favourites list lives only in your browser's `localStorage` and stays there until you remove individual titles, clear it, or clear your browser's site data — we have no way to see or delete it for you, since it never reaches our servers.
- The "Trending Discussions" content is static, seeded editorial content, not user-submitted data.
- Standard server/hosting logs are retained only as long as the hosting provider's own defaults dictate, and are not actively mined by us.
- Emails you send us are kept only as long as needed to address your message.

## 11. Data Security

We take reasonable, common-sense precautions (for example, API keys for TMDB/OMDB/Anthropic/Gemini live only on the backend server and are never exposed to your browser — see the project's own backend documentation). That said, this is a solo/student project rather than an enterprise production service, and no method of transmission or storage over the internet is ever 100% secure. We can't guarantee absolute security, and use of the site is at your own risk.

## 12. Children's Privacy

CineMellon® is not directed at children, and we do not knowingly collect personal information from anyone, including children under 13 (or the relevant minimum age in your region). If you believe a child has provided us information via email, contact us and we'll delete it.

## 13. Your Rights & Choices

Because CineMellon® doesn't maintain accounts or profiles, there usually isn't a stored personal record to access, correct, or delete on our end. Where relevant rights do apply (for example, under India's Digital Personal Data Protection Act, 2023, the EU's GDPR, or similar laws, to the extent they apply to a project like this):

- You can email [cinemellon.org@gmail.com](mailto:cinemellon.org@gmail.com) with any question, concern, or request relating to a message you sent us.
- You can block or limit third-party requests (like Google Fonts) using your browser's privacy settings, tracker blockers, or extensions — the site will still work, just with fallback fonts.
- Your Favourites list is entirely in your control: remove titles one at a time from the Favourites page, or clear it all at once via your browser's site data / storage settings for CineMellon®.
- You can simply stop using the site at any time.

## 14. International Users

CineMellon® may be accessed from anywhere and may be hosted on infrastructure located outside your own country (Vercel's and AWS's servers are typically located in the United States and other regions, depending on configuration). By using the site, you understand that any information described in this policy may be processed in a country with different data protection laws than your own.

## 15. Changes to This Policy

This project may evolve — features may be added or removed as it develops further. If this policy changes, we'll update the "Last updated" date at the top. Since there's no account/email list, we won't be able to notify you directly, so please check back if you're curious.

## 16. Contact Us

Questions about this policy or how CineMellon® works? Reach out:

**Team Arsonists**
📧 [cinemellon.org@gmail.com](mailto:cinemellon.org@gmail.com)