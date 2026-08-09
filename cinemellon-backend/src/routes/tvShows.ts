import { Router, Request, Response, NextFunction } from "express";
import { getTvShowDetails, getSeasonEpisodes } from "../services/tvmaze.js";

export const tvShowsRouter = Router();

tvShowsRouter.get("/show/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const match = id.match(/^tvmaze-(\d+)$/);
    if (!match) return res.status(404).json({ error: "Unknown show id format" });

    const show = await getTvShowDetails(Number(match[1]));
    res.json(show);
  } catch (err) {
    next(err);
  }
});

/** Fetched lazily when a season is expanded in the UI — see
 * getSeasonEpisodes in services/tvmaze.ts for why this isn't just embedded
 * in GET /show/:id up front. */
tvShowsRouter.get("/show/:id/season/:seasonId/episodes", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seasonId = Number(req.params.seasonId);
    if (!Number.isFinite(seasonId)) return res.status(404).json({ error: "Invalid season id" });

    const episodes = await getSeasonEpisodes(seasonId);
    res.json(episodes);
  } catch (err) {
    next(err);
  }
});
