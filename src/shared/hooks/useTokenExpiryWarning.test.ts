import {
  getTokenExpiryWarningDelay,
  TOKEN_EXPIRY_WARNING_MS,
} from "./useTokenExpiryWarning";

function createJwt(expSeconds: number): string {
  const payload = window
    .btoa(JSON.stringify({ exp: expSeconds }))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${payload}.signature`;
}

describe("getTokenExpiryWarningDelay", () => {
  it("returns delay until five minutes before expiry", () => {
    const nowMs = 1_000_000;
    const expiryMs = nowMs + 10 * 60 * 1000;
    const token = createJwt(expiryMs / 1000);

    expect(getTokenExpiryWarningDelay(token, nowMs)).toBe(5 * 60 * 1000);
  });

  it("returns zero when token expires inside the warning window", () => {
    const nowMs = 1_000_000;
    const expiryMs = nowMs + TOKEN_EXPIRY_WARNING_MS - 10_000;
    const token = createJwt(expiryMs / 1000);

    expect(getTokenExpiryWarningDelay(token, nowMs)).toBe(0);
  });

  it("returns null for expired or invalid tokens", () => {
    const nowMs = 1_000_000;
    expect(
      getTokenExpiryWarningDelay(createJwt((nowMs - 1000) / 1000), nowMs),
    ).toBeNull();
    expect(getTokenExpiryWarningDelay("not-a-jwt", nowMs)).toBeNull();
  });
});
