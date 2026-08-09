import { Router, Request, Response, NextFunction } from "express";
import { searchTmdbPaginated } from "../services/tmdb.js";
import { searchOmdb } from "../services/omdb.js";
import { searchTvShows } from "../services/tvmaze.js";
import { checkForTypo } from "../services/spellcheck.js";
import { PaginatedResult, MovieSummary, TvShowSummary } from "../types.js";

export const searchResultsRouter = Router();

const EMPTY_PAGE = { results: [], page: 1, totalPages: 0, totalResults: 0 };

/**
 * Movie search for the full results page: TMDB first (server-side
 * pagination), falling back to OMDB only if TMDB fails, is unconfigured,
 * or returns zero results. Distinct from GET /search, used by the
 * SearchBar dropdown.
 */
searchResultsRouter.get("/search/movies", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    if (!q) return res.json(EMPTY_PAGE satisfies PaginatedResult<MovieSummary>);

    let result: PaginatedResult<MovieSummary> | null = null;
    try {
      const tmdbResult = await searchTmdbPaginated(q, page);
      if (tmdbResult.totalResults > 0) result = tmdbResult;
    } catch (err) {
      console.error("[search/movies] TMDB search failed, falling back to OMDB:", err);
    }

    if (!result) result = await searchOmdb(q, page, "movie");

    res.json(result);
  } catch (err) {
    next(err);
  }
});

const TV_PAGE_SIZE = 10;

/**
 * Series search: TVmaze has no page parameter — it returns its full ranked
 * match set in one call. Pagination here is slicing that set server-side,
 * so the frontend's pagination UI behaves the same for both media types.
 */
searchResultsRouter.get("/search/series", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    if (!q) return res.json(EMPTY_PAGE satisfies PaginatedResult<TvShowSummary>);

    let all: TvShowSummary[] = [];
    try {
      all = await searchTvShows(q);
    } catch (err) {
      // TVmaze unreachable/down — degrade to "no results" rather than
      // failing the request.
      console.error("[search/series] TVmaze search failed:", err);
    }

    const totalResults = all.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / TV_PAGE_SIZE));
    const start = (page - 1) * TV_PAGE_SIZE;

    res.json({
      results: all.slice(start, start + TV_PAGE_SIZE),
      page,
      totalPages,
      totalResults,
    } satisfies PaginatedResult<TvShowSummary>);
  } catch (err) {
    next(err);
  }
});

/**
 * Called when a search returns zero results — checks whether the query
 * looks like a typo of a real title and, if confident, returns the
 * corrected spelling so the frontend can retry automatically. Degrades to
 * "no typo found" on any failure rather than breaking the page.
 */
searchResultsRouter.get("/search/correct", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const mediaType = req.query.type === "series" ? "series" : "movie";
    if (!q) return res.json({ hasTypo: false, corrected: "" });

    try {
      res.json(await checkForTypo(q, mediaType));
    } catch (err) {
      console.error("[search/correct] typo check failed:", err);
      res.json({ hasTypo: false, corrected: "" });
    }
  } catch (err) {
    next(err);
  }
});
