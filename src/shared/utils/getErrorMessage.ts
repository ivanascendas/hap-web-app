import { t, TFunction } from "i18next";
import { setError } from "../redux/slices/errorSlice";
import { getCorrelationId } from "./correlationId";

/**
 * Append the session correlation ID to an error message so users can
 * quote it when contacting support. Format: "msg (Ref: abc12-…)"
 */
function withCorrelationId(message: string): string {
  const id = getCorrelationId();
  // Show only the first 8 chars to keep the toast short
  return `${message} (Ref: ${id.slice(0, 8)})`;
}

/**
 * Mapping of backend Textract error message patterns to i18n keys.
 * The backend sends descriptive English error messages; we match substrings
 * to map them to localised, user-friendly messages.
 */
const TEXTRACT_ERROR_PATTERNS: Array<{
  pattern: RegExp;
  i18nKey: string;
}> = [
  {
    pattern: /unsupported.*document|format not supported/i,
    i18nKey: "ERRORS.TEXTRACT_UNSUPPORTED_DOCUMENT",
  },
  {
    pattern: /document.*too.*large|exceeds.*maximum.*size/i,
    i18nKey: "ERRORS.TEXTRACT_DOCUMENT_TOO_LARGE",
  },
  {
    pattern: /invalid.*parameter/i,
    i18nKey: "ERRORS.TEXTRACT_INVALID_PARAMETER",
  },
  {
    pattern: /bad.*document|cannot be processed.*integrity/i,
    i18nKey: "ERRORS.TEXTRACT_BAD_DOCUMENT",
  },
  {
    pattern: /throttl|too many requests|provisioned throughput/i,
    i18nKey: "ERRORS.TEXTRACT_THROTTLING",
  },
  {
    pattern: /service.*unavailable/i,
    i18nKey: "ERRORS.TEXTRACT_SERVICE_UNAVAILABLE",
  },
  {
    pattern: /document could not be processed|unexpected error.*document/i,
    i18nKey: "ERRORS.TEXTRACT_PROCESSING_ERROR",
  },
];

/**
 * Attempt to match a backend error message to a Textract-specific i18n key.
 * Returns the translated message if matched, or null if no match.
 */
export function mapTextractError(message: string): string | null {
  for (const { pattern, i18nKey } of TEXTRACT_ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return t(i18nKey);
    }
  }
  return null;
}

/**
 * Retrieves a translated error message based on the provided error type.
 *
 * @param type - The type of error (e.g., "required", "minLength", "maxLength").
 * @param tr - An optional translation function. If not provided, a default translation function `t` will be used.
 * @returns The translated error message corresponding to the error type, or the type itself if no specific message is found.
 */
export const getErrorMessage = (
  type?: string,
  tr?: TFunction<"translation", undefined>,
): string | undefined => {
  const translate = tr || t;
  switch (type) {
    case "required":
      return translate("ERRORS.REQUIRED");
    case "minLength":
      return translate("ERRORS.TOO_SHORT");
    case "maxLength":
      return translate("ERRORS.TOO_LONG");
    default:
      return type ? translate(type) : undefined;
  }
};

/**
 * Handles errors by setting an error message in the application state.
 * Includes Textract-specific error message mapping for document processing errors.
 *
 * @param error - The error object to handle.
 * @returns The result of calling `setError` with the appropriate error message.
 */
export const errorHandler = (error: unknown) => {
  console.log(error);
  if ((error as any).data) {
    const data = (error as any).data;

    if (typeof data === "string") {
      // Try Textract error mapping first
      const textractMsg = mapTextractError(data);
      if (textractMsg) {
        return setError({ message: withCorrelationId(textractMsg) });
      }
      return setError({ message: withCorrelationId(t(data)) });
    } else if (data.status == 400) {
      return setError({
        message: withCorrelationId(t("ERRORS.ACCESS_DENIED")),
      });
    }

    // Extract message from structured error response
    const rawMessage = data.detail ?? data.message;
    if (typeof rawMessage === "string") {
      const textractMsg = mapTextractError(rawMessage);
      if (textractMsg) {
        return setError({ message: withCorrelationId(textractMsg) });
      }
    }

    return setError({
      message: withCorrelationId(t(rawMessage)),
    });
  } else {
    if (error instanceof Error) {
      const textractMsg = mapTextractError(error.message);
      if (textractMsg) {
        return setError({ message: withCorrelationId(textractMsg) });
      }
      return setError({ message: withCorrelationId(t(error.message)) });
    } else if (typeof error === "string") {
      const textractMsg = mapTextractError(error);
      if (textractMsg) {
        return setError({ message: withCorrelationId(textractMsg) });
      }
      return setError({ message: withCorrelationId(t(error)) });
    } else if (
      typeof error === "object" &&
      (error as any).data &&
      typeof (error as any).data === "string"
    ) {
      return setError({ message: withCorrelationId(t((error as any).data)) });
    }
  }
  return setError({ message: withCorrelationId(t("ERRORS.UNKNOWN_ERROR")) });
};
