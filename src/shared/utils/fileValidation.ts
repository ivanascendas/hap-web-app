/**
 * Shared file validation utilities for upload forms.
 *
 * Ensures consistent validation rules across all upload inputs:
 * - File type (MIME + extension)
 * - File size (max 10 MB)
 *
 * Backend reference: AwsBankStatementReader.cs enforces the same limits server-side.
 */

/** Maximum file size in bytes (10 MB). */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Human-readable size limit. */
export const MAX_FILE_SIZE_LABEL = "10 MB";

/** MIME types accepted by the backend. */
export const ALLOWED_MIME_TYPES: readonly string[] = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/tiff",
] as const;

/**
 * File extensions shown in the HTML file-picker `accept` attribute.
 * Kept in sync with {@link ALLOWED_MIME_TYPES}.
 */
export const ALLOWED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.tiff,.tif";

export interface FileValidationError {
  /** Machine-readable error code. */
  code: "FILE_TOO_LARGE" | "INVALID_FILE_TYPE";
  /** i18n key that should be passed to `t()`. */
  i18nKey: string;
}

/**
 * Validate a single file against size and type rules.
 *
 * @returns `null` when valid, or a {@link FileValidationError} describing the issue.
 */
export function validateFile(file: File): FileValidationError | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      code: "INVALID_FILE_TYPE",
      i18nKey: "REFUNDS.UPLOAD.INVALID_FILE_TYPE",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      code: "FILE_TOO_LARGE",
      i18nKey: "REFUNDS.UPLOAD.FILE_TOO_LARGE",
    };
  }

  return null;
}

/**
 * Validate an array of files. Returns the first error found, or `null` if all
 * files pass validation.
 */
export function validateFiles(files: File[]): FileValidationError | null {
  for (const file of files) {
    const error = validateFile(file);
    if (error) return error;
  }
  return null;
}
