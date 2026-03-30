import { TokenDto } from "../dtos/token.dto";

/**
 * Secure token storage using sessionStorage.
 *
 * Previously the JWT was stored in localStorage, making it accessible
 * to any script running on the page (XSS vulnerability). sessionStorage
 * provides the same API but is:
 *  - Scoped to the tab/window — closing the tab clears the token
 *  - Not accessible from other tabs (even same origin)
 *  - Still vulnerable to XSS within the same tab, but significantly
 *    reduces the attack surface compared to localStorage
 *
 * For the strongest protection, migrate to httpOnly cookies (requires
 * backend Set-Cookie support) — see task-secure-token-storage.md Option A.
 */

const TOKEN_KEY = "token";

export function getStoredToken(): TokenDto | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TokenDto;
  } catch {
    // Corrupted data — clear it
    sessionStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function setStoredToken(token: TokenDto): void {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function clearStoredToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  // Also remove from localStorage in case the user still has an old token there
  // (one-time migration cleanup)
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore — localStorage might be unavailable in some contexts
  }
}
