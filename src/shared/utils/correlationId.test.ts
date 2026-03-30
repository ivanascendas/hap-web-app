import { getCorrelationId, resetCorrelationId } from "./correlationId";

describe("correlationId", () => {
  afterEach(() => {
    resetCorrelationId();
  });

  it("returns a non-empty string", () => {
    const id = getCorrelationId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("returns the same ID on subsequent calls (session-stable)", () => {
    const id1 = getCorrelationId();
    const id2 = getCorrelationId();
    expect(id1).toBe(id2);
  });

  it("returns a new ID after reset", () => {
    const id1 = getCorrelationId();
    resetCorrelationId();
    const id2 = getCorrelationId();
    expect(id2).not.toBe(id1);
  });

  it("looks like a UUID (8-4-4-4-12 hex pattern)", () => {
    const id = getCorrelationId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});
