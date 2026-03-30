import { parseRetryAfter } from "./customBaseQuery";

// ---------------------------------------------------------------------------
// parseRetryAfter — unit tests
// ---------------------------------------------------------------------------
describe("parseRetryAfter", () => {
  it("returns null for null input", () => {
    expect(parseRetryAfter(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseRetryAfter("")).toBeNull();
  });

  it("parses integer seconds and converts to ms", () => {
    expect(parseRetryAfter("5")).toBe(5_000);
    expect(parseRetryAfter("0")).toBe(0);
    expect(parseRetryAfter("120")).toBe(30_000); // capped at MAX_RETRY_DELAY_MS
  });

  it("caps large values at MAX_RETRY_DELAY_MS (30 000 ms)", () => {
    expect(parseRetryAfter("60")).toBe(30_000);
    expect(parseRetryAfter("999")).toBe(30_000);
  });

  it("parses HTTP-date format", () => {
    // Use a date 10 seconds from now
    const futureDate = new Date(Date.now() + 10_000).toUTCString();
    const result = parseRetryAfter(futureDate);

    expect(result).not.toBeNull();
    // Should be approximately 10 000 ms (allow 2 s tolerance for test execution)
    expect(result!).toBeGreaterThanOrEqual(8_000);
    expect(result!).toBeLessThanOrEqual(12_000);
  });

  it("returns 0 for HTTP-date in the past", () => {
    const pastDate = new Date(Date.now() - 60_000).toUTCString();
    expect(parseRetryAfter(pastDate)).toBe(0);
  });

  it("caps HTTP-date delay at MAX_RETRY_DELAY_MS", () => {
    const farFuture = new Date(Date.now() + 120_000).toUTCString();
    expect(parseRetryAfter(farFuture)).toBe(30_000);
  });

  it("returns null for unparseable string", () => {
    expect(parseRetryAfter("not-a-number-or-date")).toBeNull();
  });
});
