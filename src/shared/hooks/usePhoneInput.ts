// Создать отдельный хук для переиспользования
import { useCallback, useRef } from "react";
import { UseFormSetValue, Path } from "react-hook-form";
import { IntlTelInputRef } from "intl-tel-input/react";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: utils } = require("intl-tel-input/build/js/utils.js");

export const usePhoneInput = <T extends Record<string, any>>(
  setValue: UseFormSetValue<T>,
  fieldName: Path<T> = "Phone" as Path<T>,
) => {
  const { t } = useTranslation();
  const intlTelRef = useRef<IntlTelInputRef>();

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const instance = intlTelRef.current?.getInstance();

      if (!instance) return;

      const countryData = instance.getSelectedCountryData();

      let cleanNumber = value;

      if (cleanNumber.startsWith("+")) {
        cleanNumber = cleanNumber.substring(1);
      }

      // Убираем код страны если он уже есть в начале
      if (
        countryData?.dialCode &&
        cleanNumber.startsWith(countryData.dialCode)
      ) {
        cleanNumber = cleanNumber.substring(countryData.dialCode.length);
      }

      // Формируем финальный номер
      const phone = `+${countryData?.dialCode}${cleanNumber}`;
      console.log({
        originalValue: value,
        cleanNumber,
        dialCode: countryData?.dialCode,
        finalPhone: phone,
      });

      setValue(fieldName, phone as any);
    },
    [setValue, fieldName],
  );

  const handleItiInit = useCallback((obj: IntlTelInputRef) => {
    intlTelRef.current = obj;
  }, []);

  const validatePhone = useCallback(
    (value: string) => {
      if (!value) return t("ERRORS.PHONE_REQUIRED");

      const instance = intlTelRef.current?.getInstance();
      if (!instance) return t("ERRORS.INVALID_PHONE");

      const isValid = instance.isValidNumber() || false;
      utils.isValidNumber(value, instance.getSelectedCountryData().iso2);
      if (!isValid) {
        const errorMessage = instance.getValidationError();
        console.error("Phone validation error:", {
          errorMessage,
          value,
          instNumber: instance.getNumber(),
          isValid: utils.isValidNumber(
            value,
            instance.getSelectedCountryData().iso2,
          ),
        });
      }
      return isValid || t("ERRORS.INVALID_PHONE");
    },
    [t],
  );

  const setPhoneNumber = useCallback((phoneNumber: string) => {
    intlTelRef.current?.getInstance()?.setNumber(phoneNumber);
  }, []);

  const getFormattedPhone = useCallback(() => {
    const instance = intlTelRef.current?.getInstance();
    return instance ? instance.getNumber() : "";
  }, []);

  return {
    intlTelRef,
    handlePhoneChange, // или handlePhoneChangeAlternative
    handleItiInit,
    validatePhone,
    setPhoneNumber,
    getFormattedPhone,
  };
};
