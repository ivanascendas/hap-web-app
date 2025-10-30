/**
 * Validates Irish PPSN (Personal Public Service Number)
 *
 * @param ppsn - PPSN string to validate
 * @returns true if PPSN is valid, false otherwise
 *
 * Format:
 * - Old format: 7 digits + 1 letter (e.g. 1234567T)
 * - New format: 7 digits + 2 letters (e.g. 1234567TW)
 */
export const validatePPSN = (ppsn: string): boolean => {
  // Normalize input: remove spaces and make uppercase
  ppsn = ppsn.trim().toUpperCase();

  // Match PPSN format:
  // - Old format: 7 digits + 1 letter (e.g. 1234567T)
  // - New format: 7 digits + 2 letters (e.g. 1234567TW)
  const ppsnPattern = /^(\d{7})([A-Z]{1,2})$/;
  const match = ppsn.match(ppsnPattern);
  if (!match) return false;

  const digits = match[1];
  const letters = match[2];

  // Weighted checksum calculation (for first letter only)
  const multipliers = [8, 7, 6, 5, 4, 3, 2];
  let total = 0;

  for (let i = 0; i < 7; i++) {
    total += parseInt(digits[i], 10) * multipliers[i];
  }

  // If there is a 2nd letter (new format), include it in the checksum
  if (letters.length === 2) {
    const secondLetterValue = letters.charCodeAt(1) - 64; // A=1, B=2, etc.
    total += secondLetterValue * 9;
  }

  const remainder = total % 23;
  const checkChar = remainder === 0 ? "W" : String.fromCharCode(64 + remainder);

  // Compare calculated check character with the first letter
  return letters[0] === checkChar;
};
