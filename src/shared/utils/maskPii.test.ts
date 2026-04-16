import { maskIban, maskBic, maskPpsn, maskAddress, maskPii } from "./maskPii";

describe("maskPii utilities", () => {
  describe("maskIban", () => {
    it("masks a standard Irish IBAN keeping country code and last 4", () => {
      const result = maskIban("IE29AIBK93115212345678");
      // 22 chars → IE + 16 masked + 5678, formatted: "IE** **** **** **** **56 78"
      expect(result).toBe("IE** **** **** **** **56 78");
    });

    it("masks a pre-formatted IBAN (with spaces)", () => {
      const result = maskIban("IE29 AIBK 9311 5212 3456 78");
      // Spaces stripped first, same result
      expect(result).toBe("IE** **** **** **** **56 78");
    });

    it("returns dash for null", () => {
      expect(maskIban(null)).toBe("-");
    });

    it("returns dash for undefined", () => {
      expect(maskIban(undefined)).toBe("-");
    });

    it("returns dash for empty string", () => {
      expect(maskIban("")).toBe("-");
    });

    it("fully masks very short IBAN (6 chars or fewer)", () => {
      expect(maskIban("IE29")).toBe("****");
    });

    it("formats output in groups of 4 with spaces", () => {
      const result = maskIban("IE29AIBK93115212345678");
      const groups = result.split(" ");
      // All groups except possibly last should be 4 chars
      for (let i = 0; i < groups.length - 1; i++) {
        expect(groups[i]).toHaveLength(4);
      }
    });
  });

  describe("maskBic", () => {
    it("masks a standard 8-char BIC showing last 4", () => {
      const result = maskBic("AIBKIE2D");
      expect(result).toBe("****IE2D");
    });

    it("masks an 11-char BIC showing last 4", () => {
      const result = maskBic("AIBKIE2DXXX");
      expect(result).toBe("*******DXXX");
    });

    it("returns dash for null", () => {
      expect(maskBic(null)).toBe("-");
    });

    it("returns dash for undefined", () => {
      expect(maskBic(undefined)).toBe("-");
    });

    it("returns dash for empty string", () => {
      expect(maskBic("")).toBe("-");
    });

    it("fully masks BIC with 4 or fewer chars", () => {
      expect(maskBic("AIB")).toBe("***");
    });
  });

  describe("maskPpsn", () => {
    it("fully masks a standard 8-char PPSN", () => {
      expect(maskPpsn("1234567T")).toBe("********");
    });

    it("masks PPSN of any length", () => {
      expect(maskPpsn("1234567TW")).toBe("*********");
    });

    it("returns dash for null", () => {
      expect(maskPpsn(null)).toBe("-");
    });

    it("returns dash for undefined", () => {
      expect(maskPpsn(undefined)).toBe("-");
    });

    it("returns dash for empty string", () => {
      expect(maskPpsn("")).toBe("-");
    });
  });

  describe("maskAddress", () => {
    it("shows only a short prefix for a full address", () => {
      expect(maskAddress("10 Main Street, Dublin")).toBe("10 Main ...");
    });

    it("normalizes whitespace before masking", () => {
      expect(maskAddress("10 Main  Street\nDublin")).toBe("10 Main ...");
    });

    it("does not expose complete short addresses", () => {
      expect(maskAddress("Main St")).toBe("Mai...");
    });

    it("returns dash for null, undefined, or empty values", () => {
      expect(maskAddress(null)).toBe("-");
      expect(maskAddress(undefined)).toBe("-");
      expect(maskAddress("")).toBe("-");
      expect(maskAddress("   ")).toBe("-");
    });
  });

  describe("maskPii (generic dispatcher)", () => {
    it("dispatches to maskIban for type iban", () => {
      const result = maskPii("IE29AIBK93115212345678", "iban");
      expect(result).toBe("IE** **** **** **** **56 78");
    });

    it("dispatches to maskBic for type bic", () => {
      expect(maskPii("AIBKIE2D", "bic")).toBe("****IE2D");
    });

    it("dispatches to maskPpsn for type ppsn", () => {
      expect(maskPii("1234567T", "ppsn")).toBe("********");
    });

    it("dispatches to maskAddress for type address", () => {
      expect(maskPii("10 Main Street, Dublin", "address")).toBe("10 Main ...");
    });

    it("returns dash for null with any type", () => {
      expect(maskPii(null, "iban")).toBe("-");
      expect(maskPii(null, "bic")).toBe("-");
      expect(maskPii(null, "ppsn")).toBe("-");
      expect(maskPii(null, "address")).toBe("-");
    });
  });
});
