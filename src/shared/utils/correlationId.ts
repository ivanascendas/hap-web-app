/**
 * Correlation ID utility for end-to-end request tracing.
 *
 * Generates a single UUID per browser session and provides it to
 * `customBaseQuery`'s `prepareHeaders` so every API request carries
 * the same `X-Correlation-Id` header. The backend CorrelationIdMiddleware
 * will echo it back, making it easy to trace logs across frontend + backend.
 */

let sessionCorrelationId: string | null = null;

/**
 * Generate a v4-ish UUID using crypto.randomUUID (available in all modern
 * browsers) with a Math.random fallback for test / older environments.
 */
function generateUUID(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback: simple v4-like UUID via Math.random
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Return the current session's correlation ID, generating one on first call.
 */
export function getCorrelationId(): string {
  if (!sessionCorrelationId) {
    sessionCorrelationId = generateUUID();
  }
  return sessionCorrelationId;
}

/**
 * Reset the correlation ID (useful for tests or forced session refresh).
 */
export function resetCorrelationId(): void {
  sessionCorrelationId = null;
}
