import { t, TFunction } from "i18next";
import { setError } from "../redux/slices/errorSlice";

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
 *
 * @param error - The error object to handle.
 * @returns The result of calling `setError` with the appropriate error message.
 */
export const errorHandler = (
  error: unknown
) => {
  console.log(error);
  if ((error as any).data) {
    if ((error as any).data.status == 400) {
      return setError({ message: t("ERRORS.ACCESS_DENIED") });
    }
    return setError({ message: t((error as any).data.message) });
  } else {
    if (error instanceof Error) {
      return setError({ message: t(error.message) });
    } else
      if (typeof error === "string") {
        return setError({ message: t(error) });
      }
  }
  return setError({ message: t("ERRORS.UNKNOWN_ERROR") });
};