/**
 * PII masking utilities for IBAN, BIC, and PPSN fields.
 *
 * Masking rules (from task-mask-pii-display):
 *  - IBAN: show country code (first 2 chars) + last 4 digits, rest masked
 *         e.g. "IE29AIBK93115212345678" → "IE** **** **** **** **56 78"
 *  - BIC:  show last 4 chars, rest masked
 *         e.g. "AIBKIE2D" → "****IE2D"
 *  - PPSN: fully masked
 *         e.g. "1234567T" → "********"
 */

const MASK_CHAR = "*";

/**
 * Mask an IBAN value.
 * Keeps the first 2 characters (country code) and the last 4 digits visible.
 * Formats in groups of 4 separated by spaces (standard IBAN display).
 */
export function maskIban(iban: string | null | undefined): string {
  if (!iban) return "-";
  // Strip whitespace for uniform processing
  const clean = iban.replace(/\s/g, "");
  if (clean.length <= 6) {
    // Too short to meaningfully mask — mask entirely
    return MASK_CHAR.repeat(clean.length);
  }

  const prefix = clean.slice(0, 2); // country code
  const suffix = clean.slice(-4); // last 4 chars
  const middleLen = clean.length - 2 - 4;
  const masked = prefix + MASK_CHAR.repeat(middleLen) + suffix;

  // Format in groups of 4 with spaces
  return masked.replace(/(.{4})(?=.)/g, "$1 ");
}

/**
 * Mask a BIC/SWIFT value.
 * Shows the last 4 characters, masks the rest.
 */
export function maskBic(bic: string | null | undefined): string {
  if (!bic) return "-";
  const clean = bic.replace(/\s/g, "");
  if (clean.length <= 4) {
    return MASK_CHAR.repeat(clean.length);
  }
  const visiblePart = clean.slice(-4);
  const maskedPart = MASK_CHAR.repeat(clean.length - 4);
  return maskedPart + visiblePart;
}

/**
 * Mask a PPSN (PPS Number) value.
 * Fully masked — no characters visible.
 */
export function maskPpsn(ppsn: string | null | undefined): string {
  if (!ppsn) return "-";
  return MASK_CHAR.repeat(ppsn.length);
}

export type PiiType = "iban" | "bic" | "ppsn";

/**
 * Generic masking dispatcher.
 */
export function maskPii(
  value: string | null | undefined,
  type: PiiType,
): string {
  switch (type) {
    case "iban":
      return maskIban(value);
    case "bic":
      return maskBic(value);
    case "ppsn":
      return maskPpsn(value);
    default:
      return value || "-";
  }
}
