import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import "dayjs/locale/ru";
import "dayjs/locale/en";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

/**
 * Formats a date string for display in version history.
 *
 * Examples:
 * - Today: "Сегодня в 15:00" or "Today at 15:00"
 * - Yesterday: "Вчера в 12:45" or "Yesterday at 12:45"
 * - Earlier: "27 янв в 12:45" or "27 Jan at 12:45"
 *
 * @param isoDate - ISO 8601 date string
 * @param locale - Language locale ('ru' or 'en', defaults to 'en')
 * @returns Formatted date string
 */
export function formatVersionDate(
  isoDate: string,
  locale: string = "en",
): string {
  const d = dayjs(isoDate).locale(locale);
  const time = d.format("HH:mm");

  if (d.isToday()) {
    return locale === "ru" ? `Сегодня в ${time}` : `Today at ${time}`;
  }

  if (d.isYesterday()) {
    return locale === "ru" ? `Вчера в ${time}` : `Yesterday at ${time}`;
  }

  // For earlier dates: "27 янв в 12:45" / "27 Jan at 12:45"
  const dateStr = d.format("D MMM");
  return locale === "ru" ? `${dateStr} в ${time}` : `${dateStr} at ${time}`;
}
