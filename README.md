# CineMellon

A movie and TV show exploration platform with AI-generated editorial content — trivia, timelines, hidden details, character analysis, and more — plus a live trending-discussions feed and personal favourites.

**[Live:]** https://cinemellon-arsonists.vercel.app/

## Stack

| | |
|---|---|
| **Frontend** | [`cinemellon/`](./cinemellon) — React 19, TypeScript, Tailwind CSS, TanStack Query. Deployed on Vercel. |
| **Backend** | [`cinemellon-backend/`](./cinemellon-backend) — Node.js, Express, SQLite. Deployed on Render. |
| **Data** | [TMDB](https://www.themoviedb.org/) and [OMDB](https://www.omdbapi.com/) for movies, [TVmaze](https://www.tvmaze.com/) for TV shows. |
| **AI** | Anthropic Claude and Google Gemini, selectable per deployment, used for editorial content generation with forced structured output. |

## Getting started

Run the backend first, then the frontend, in separate terminals:

```bash
# 1. Backend
cd cinemellon-backend
npm install
cp .env.example .env    # fill in a TMDB token + an AI provider key
npm run seed
npm run dev              # http://localhost:4000

# 2. Frontend
cd cinemellon
npm install
echo "VITE_API_BASE_URL=http://localhost:4000" > .env.local
npm run dev               # http://localhost:5173
```

The frontend also runs standalone on mock data with no backend and no setup — see [`cinemellon/README.md`](./cinemellon/README.md). For the full API reference and environment variables, see [`cinemellon-backend/README.md`](./cinemellon-backend/README.md).

## Team

Built by **Team Arsonists** — Pranav Bardiyar and Arunish Choubey — as the project deliverable for the AICTE | IBM SkillsBuild Generative AI & Cloud Computing internship, Birsa Institute of Technology, Sindri.
