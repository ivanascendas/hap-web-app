import { t } from "i18next";

export const getErrorMessage = (type?: string): string | undefined => {
  switch (type) {
    case "required":
      return t("ERRORS.REQUIRED");
    case "minLength":
      return t("ERRORS.MIN_LENGTH");
    case "maxLength":
      return t("ERRORS.MAX_LENGTH");
    case "pattern":
      return t("ERRORS.PATTERN");
    default:
      return undefined;
  }
};
