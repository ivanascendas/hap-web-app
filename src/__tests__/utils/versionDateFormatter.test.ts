import { formatVersionDate } from "../../shared/utils/versionDateFormatter";
import dayjs from "dayjs";

describe("formatVersionDate", () => {
  // Mock dayjs to control current date

  beforeEach(() => {
    // Reset to real dayjs behavior
    jest.restoreAllMocks();
  });

  describe("English locale (en)", () => {
    const locale = "en";

    it('should format today date as "Today at HH:mm"', () => {
      const today = dayjs().format();
      const result = formatVersionDate(today, locale);
      expect(result).toMatch(/^Today at \d{2}:\d{2}$/);
    });

    it('should format yesterday date as "Yesterday at HH:mm"', () => {
      const yesterday = dayjs().subtract(1, "day").format();
      const result = formatVersionDate(yesterday, locale);
      expect(result).toMatch(/^Yesterday at \d{2}:\d{2}$/);
    });

    it('should format earlier dates as "DD MMM at HH:mm"', () => {
      const fiveDaysAgo = dayjs().subtract(5, "day").format();
      const result = formatVersionDate(fiveDaysAgo, locale);
      expect(result).toMatch(/^\d{1,2} \w+ at \d{2}:\d{2}$/);
    });

    it("should handle ISO 8601 date strings correctly", () => {
      const isoDate = dayjs().subtract(1, "day").toISOString();
      const result = formatVersionDate(isoDate, locale);
      expect(result).toMatch(/^Yesterday at \d{2}:\d{2}$/);
    });

    it("should preserve time in the output", () => {
      const specificTime = dayjs("2024-03-15 14:30:00").format();
      const result = formatVersionDate(specificTime, locale);
      expect(result).toContain("14:30");
    });
  });

  describe("Russian locale (ru)", () => {
    const locale = "ru";

    it('should format today date as "Сегодня в HH:mm"', () => {
      const today = dayjs().format();
      const result = formatVersionDate(today, locale);
      expect(result).toMatch(/^Сегодня в \d{2}:\d{2}$/);
    });

    it('should format yesterday date as "Вчера в HH:mm"', () => {
      const yesterday = dayjs().subtract(1, "day").format();
      const result = formatVersionDate(yesterday, locale);
      expect(result).toMatch(/^Вчера в \d{2}:\d{2}$/);
    });

    it('should format earlier dates as "DD месяц в HH:mm"', () => {
      const fiveDaysAgo = dayjs().subtract(5, "day").format();
      const result = formatVersionDate(fiveDaysAgo, locale);
      expect(result).toMatch(/^\d{1,2} \w+ в \d{2}:\d{2}$/);
    });

    it("should use Russian month names", () => {
      // Create a specific date: January 15, 2024
      const janDate = "2024-01-15T12:30:00Z";
      const result = formatVersionDate(janDate, locale);
      // Should contain Russian month "янв" (January)
      expect(result).toContain("янв");
      expect(result).toContain("12:30");
    });

    it("should handle ISO 8601 date strings correctly", () => {
      const isoDate = dayjs().subtract(1, "day").toISOString();
      const result = formatVersionDate(isoDate, locale);
      expect(result).toMatch(/^Вчера в \d{2}:\d{2}$/);
    });

    it("should preserve time in the output", () => {
      const specificTime = dayjs("2024-03-15 14:30:00").format();
      const result = formatVersionDate(specificTime, locale);
      expect(result).toContain("14:30");
    });
  });

  describe("Default locale behavior", () => {
    it("should use English by default when locale not specified", () => {
      const today = dayjs().format();
      const result = formatVersionDate(today);
      expect(result).toMatch(/^Today at \d{2}:\d{2}$/);
    });

    it("should handle undefined locale parameter", () => {
      const today = dayjs().format();
      const result = formatVersionDate(today, undefined);
      expect(result).toMatch(/^Today at \d{2}:\d{2}$/);
    });
  });

  describe("Edge cases", () => {
    it("should handle midnight time", () => {
      const midnight = dayjs("2024-03-15 00:00:00").format();
      const result = formatVersionDate(midnight, "en");
      expect(result).toContain("00:00");
    });

    it("should handle end of day time", () => {
      const endOfDay = dayjs("2024-03-15 23:59:00").format();
      const result = formatVersionDate(endOfDay, "en");
      expect(result).toContain("23:59");
    });

    it("should handle dates from current month", () => {
      const tenDaysAgo = dayjs().subtract(10, "day").format();
      const result = formatVersionDate(tenDaysAgo, "en");
      expect(result).toMatch(/^\d{1,2} \w+ at \d{2}:\d{2}$/);
    });

    it("should handle very old dates", () => {
      const oneYearAgo = dayjs().subtract(1, "year").format();
      const result = formatVersionDate(oneYearAgo, "en");
      expect(result).toMatch(/^\d{1,2} \w+ at \d{2}:\d{2}$/);
    });
  });
});
