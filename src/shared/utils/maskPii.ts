/**
 * PII masking utilities for IBAN, BIC, PPSN, and address fields.
 *
 * Masking rules (from task-mask-pii-display):
 *  - IBAN: show country code (first 2 chars) + last 4 digits, rest masked
 *         e.g. "IE29AIBK93115212345678" → "IE** **** **** **** **56 78"
 *  - BIC:  show last 4 chars, rest masked
 *         e.g. "AIBKIE2D" → "****IE2D"
 *  - PPSN: fully masked
 *         e.g. "1234567T" → "********"
 *  - Address: show a short prefix only, then ellipsis
 *         e.g. "10 Main Street, Dublin" → "10 Main ..."
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

/**
 * Mask an address value.
 * Keeps enough context for list scanning without exposing the full address.
 */
export function maskAddress(address: string | null | undefined): string {
  if (!address) return "-";
  const normalized = address.replace(/\s+/g, " ").trim();
  if (!normalized) return "-";
  if (normalized.length <= 4) {
    return MASK_CHAR.repeat(normalized.length);
  }
  const visibleLength = normalized.length <= 12 ? 3 : 8;
  return `${normalized.slice(0, visibleLength)}...`;
}

export type PiiType = "iban" | "bic" | "ppsn" | "address";

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
    case "address":
      return maskAddress(value);
    default:
      return value || "-";
  }
}
