import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "./secureTokenStorage";
import { TokenDto } from "../dtos/token.dto";

const fakeToken: TokenDto = {
  access_token: "eyJhbGciOiJIUzI1NiJ9.test",
  token_type: "bearer",
  expires_in: 3600,
  phoneNumber: "+353851234567",
  email: "test@example.com",
  ".issued": "Mon, 30 Mar 2026 00:00:00 GMT",
  ".expires": "Mon, 30 Mar 2026 01:00:00 GMT",
  two_factor_auth: 1,
  defaultmfa: undefined,
};

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

describe("setStoredToken", () => {
  it("stores the token in sessionStorage as JSON", () => {
    setStoredToken(fakeToken);
    const raw = sessionStorage.getItem("token");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(fakeToken);
  });

  it("does NOT store the token in localStorage", () => {
    setStoredToken(fakeToken);
    expect(localStorage.getItem("token")).toBeNull();
  });
});

describe("getStoredToken", () => {
  it("returns null when no token is stored", () => {
    expect(getStoredToken()).toBeNull();
  });

  it("returns the token when it exists in sessionStorage", () => {
    sessionStorage.setItem("token", JSON.stringify(fakeToken));
    expect(getStoredToken()).toEqual(fakeToken);
  });

  it("returns null and clears corrupted data", () => {
    sessionStorage.setItem("token", "not-valid-json{{{");
    expect(getStoredToken()).toBeNull();
    expect(sessionStorage.getItem("token")).toBeNull();
  });
});

describe("clearStoredToken", () => {
  it("removes the token from sessionStorage", () => {
    sessionStorage.setItem("token", JSON.stringify(fakeToken));
    clearStoredToken();
    expect(sessionStorage.getItem("token")).toBeNull();
  });

  it("also removes any leftover token from localStorage (migration)", () => {
    localStorage.setItem("token", JSON.stringify(fakeToken));
    clearStoredToken();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("does not throw when localStorage is empty", () => {
    expect(() => clearStoredToken()).not.toThrow();
  });
});

describe("round-trip", () => {
  it("set then get returns the same token", () => {
    setStoredToken(fakeToken);
    const retrieved = getStoredToken();
    expect(retrieved).toEqual(fakeToken);
  });

  it("set then clear then get returns null", () => {
    setStoredToken(fakeToken);
    clearStoredToken();
    expect(getStoredToken()).toBeNull();
  });
});
