export interface FunError {
  code: number;
  message: string;
}

/**
 * Shown in place of raw backend error text ("Backend request failed: GET
 * /search?q=... → 500 Internal Server Error") anywhere a request fails.
 * The real error still goes to the console via console.error for debugging.
 *
 * SEARCH_ERROR covers search/fetch failures; DETAILS_ERROR covers a
 * specific movie/show failing to load.
 */
export const SEARCH_ERROR: FunError = {
  code: 616,
  message: "One does not simply walk into Mordor.",
};

export const DETAILS_ERROR: FunError = {
  code: 1954,
  message: "You shall not pass!",
};
