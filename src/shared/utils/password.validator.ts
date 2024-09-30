import React from "react";

export type PasswordValidatorConfig = {
  minLength?: number;
  maxLength?: number;
  hasNumber?: boolean;
  hasSpecialChar?: boolean;
  hasUpperCase?: boolean;
  hasLowerCase?: boolean;
  charRepeating?: number;
};

export type PasswordValidationResult = {
  valid: boolean;
  errorMessage?: string;
};

export const passwordValidator = (
  config: PasswordValidatorConfig,
  value: string,
): PasswordValidationResult => {
  const {
    minLength,
    maxLength,
    hasNumber,
    hasSpecialChar,
    hasUpperCase,
    hasLowerCase,
    charRepeating,
  } = config;

  if (value && minLength && value.length < minLength) {
    return {
      valid: false,
      errorMessage: `passwordValidationMinLength`,
    };
  }

  if (value && maxLength && value.length > maxLength) {
    return {
      valid: false,
      errorMessage: `passwordValidationMAXLength`,
    };
  }

  if (value && hasNumber && /[0-9]+/.test(value) === false) {
    return {
      valid: false,
      errorMessage: `passwordValidationMAXLength`,
    };
  }

  if (value && hasUpperCase && /[A-Z]+/.test(value) === false) {
    return {
      valid: false,
      errorMessage: `passwordValidationMAXLength`,
    };
  }

  if (value && hasLowerCase && /[a-z]+/.test(value) === false) {
    return {
      valid: false,
      errorMessage: `passwordValidationMAXLength`,
    };
  }

  if (
    value &&
    hasSpecialChar &&
    /[!@#$%^&*(),.?":{}|<>]+/.test(value) === false
  ) {
    return {
      valid: false,
      errorMessage: `passwordValidationMAXLength`,
    };
  }

  if (
    value &&
    charRepeating &&
    new RegExp(`((\\w)\\2{${charRepeating},})`).test(value)
  ) {
    return {
      valid: false,
      errorMessage: `passwordValidationMAXLength`,
    };
  }

  return {
    valid: true,
  };
};

export const usePasswordValidator = (
  config: PasswordValidatorConfig,
): [(val: string) => boolean, boolean, string | undefined] => {
  const [isValid, setIsValid] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined,
  );
  return [
    (value: string): boolean => {
      const result = passwordValidator(config, value);
      setIsValid(result.valid);
      setErrorMessage(result.errorMessage);
      return result.valid;
    },
    isValid,
    errorMessage,
  ];
};
