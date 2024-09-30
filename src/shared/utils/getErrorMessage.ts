import { t, TFunction } from "i18next";

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
