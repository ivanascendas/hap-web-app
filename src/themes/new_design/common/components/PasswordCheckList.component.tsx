import {
  passwordValidator,
  PasswordValidatorConfig,
} from "@shared/utils/password.validator";
import "./PasswordCheckList.component.scss";
import { useTranslation } from "react-i18next";
export type PasswordCheckListProps = {
  value: string;
} & PasswordValidatorConfig;
export const PasswordCheckList = ({
  value,
  minLength,
  maxLength,
  hasNumber,
  hasSpecialChar,
  hasUpperCase,
  hasLowerCase,
  charRepeating,
}: PasswordCheckListProps): JSX.Element => {
  const { t } = useTranslation();
  const { valid: isMinLengthValid } = passwordValidator({ minLength }, value);
  const { valid: isMaxLengthValid } = passwordValidator({ maxLength }, value);
  const { valid: isHasLowerCaseValid } = passwordValidator(
    { hasLowerCase },
    value,
  );
  const { valid: isHasUpperCaseValid } = passwordValidator(
    { hasUpperCase },
    value,
  );
  const { valid: isHasSpecialCharValid } = passwordValidator(
    { hasSpecialChar },
    value,
  );
  const { valid: isCharRepeatingValid } = passwordValidator(
    { charRepeating },
    value,
  );
  const { valid: isHasNumberValid } = passwordValidator({ hasNumber }, value);
  console.log(
    `isHasNumberValid:${isHasNumberValid}, value:${value}`,
    isHasNumberValid,
  );
  return (
    <div className="password-checklist">
      <ul>
        {minLength && (
          <li>
            <i
              className={`fas fa-${value ? (isMinLengthValid ? "check" : "times") : "circle-o"}`}
            ></i>{" "}
            {t("ERRORS.passwordValidationMinLength")}
          </li>
        )}
        {maxLength && (
          <li>
            <i
              className={`fas fa-${value ? (isMaxLengthValid ? "check" : "times") : "circle-o"}`}
            ></i>{" "}
            {t("ERRORS.passwordValidationMaxLength")}
          </li>
        )}
        {hasLowerCase && (
          <li>
            <i
              className={`fas fa-${value ? (isHasLowerCaseValid ? "check" : "times") : "circle-o"}`}
            ></i>{" "}
            {t("ERRORS.passwordValidationLowerCase")}
          </li>
        )}
        {hasUpperCase && (
          <li>
            <i
              className={`fas fa-${value ? (isHasUpperCaseValid ? "check" : "times") : "circle-o"}`}
            ></i>{" "}
            {t("ERRORS.passwordValidationUpperCase")}
          </li>
        )}
        {hasSpecialChar && (
          <li>
            <i
              className={`fas fa-${value ? (isHasSpecialCharValid ? "check" : "times") : "circle-o"}`}
            ></i>{" "}
            {t("ERRORS.passwordValidationSpecialChars")}
          </li>
        )}
        {charRepeating && (
          <li>
            <i
              className={`fas fa-${value ? (isCharRepeatingValid ? "check" : "times") : "circle-o"}`}
            ></i>{" "}
            {t("ERRORS.passwordValidationMAXLength")}
          </li>
        )}
        {hasNumber && (
          <li>
            <i
              className={`fas fa-${value ? (isHasNumberValid ? "check" : "times") : "circle-o"}`}
            ></i>{" "}
            {t("ERRORS.passwordValidationNumbers")}
          </li>
        )}
      </ul>
    </div>
  );
};
