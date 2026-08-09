import dns from "node:dns";

// Node prefers IPv6 by default, which fails silently (ECONNRESET) on networks
// with broken IPv6 routing. Forcing IPv4 resolution avoids that class of error.
dns.setDefaultResultOrder("ipv4first");

const TRANSIENT_ERROR_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "ENOTFOUND",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
]);

function isTransientNetworkError(err: unknown): boolean {
  const cause = (err as { cause?: unknown })?.cause as { code?: string } | undefined;
  const code = cause?.code ?? (err as { code?: string })?.code;
  return typeof code === "string" && TRANSIENT_ERROR_CODES.has(code);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ResilientFetchOptions extends RequestInit {
  /** Per-attempt timeout in ms. Default 15s. */
  timeoutMs?: number;
  /** How many times to retry on transient network errors. Default 2 (3 attempts total). */
  retries?: number;
}

/**
 * Drop-in replacement for `fetch` with a request timeout and automatic
 * retries (with backoff) on transient connection errors. HTTP error
 * responses (4xx/5xx) are not retried — those are returned as-is.
 */
export async function resilientFetch(url: string, options: ResilientFetchOptions = {}): Promise<Response> {
  const { timeoutMs = 15_000, retries = 2, ...init } = options;

  // Some firewalls flag headerless requests as bot traffic; send an
  // identifiable User-Agent unless the caller already set one.
  const headers = new Headers(init.headers);
  if (!headers.has("user-agent")) headers.set("User-Agent", "Cinemellon/1.0 (+backend fetch)");

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { ...init, headers, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;

      const isTimeout = (err as { name?: string })?.name === "AbortError";
      const shouldRetry = (isTimeout || isTransientNetworkError(err)) && attempt < retries;

      if (!shouldRetry) throw err;

      // Exponential backoff: 300ms, 900ms, ...
      await sleep(300 * 3 ** attempt);
    }
  }

  // Unreachable, but keeps TypeScript happy.
  throw lastError;
}
