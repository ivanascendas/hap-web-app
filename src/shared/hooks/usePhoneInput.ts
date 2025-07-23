import { useCallback, useRef, useMemo, useState } from "react";
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
  const [value, setInputValue] = useState<string>("");

  const phoneState = useMemo(
    () => ({
      lastValidNumber: "",
      lastCountryCode: "",
      isProcessing: false,
    }),
    [],
  );

  const cleanPhoneNumber = useCallback((number: string, dialCode?: string) => {
    // console.log('cleanPhoneNumber called with:', number, dialCode);
    if (!number) return "";

    let cleaned = number.replace(/\D/g, "");

    if (dialCode && cleaned.startsWith(dialCode)) {
      cleaned = cleaned.substring(dialCode.length);
    }

    return cleaned;
  }, []);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log('handlePhoneChange called with:', e.target.value);
      if (phoneState.isProcessing) return;

      const { value } = e.target;
      const instance = intlTelRef.current?.getInstance();

      if (!instance) return;

      phoneState.isProcessing = true;

      try {
        const countryData = instance.getSelectedCountryData();
        const dialCode = countryData?.dialCode;

        const fullNumber = instance.getNumber();

        if (fullNumber && utils.isValidNumber(fullNumber, countryData?.iso2)) {
          phoneState.lastValidNumber = fullNumber;
          phoneState.lastCountryCode = dialCode || "";
          //  console.log('handlePhoneChange: Valid full number:', fullNumber);
          setValue(fieldName, fullNumber as any);
        } else {
          const cleanedNumber = cleanPhoneNumber(value, dialCode);
          //  console.log('handlePhoneChange: Cleaned number:', cleanedNumber);
          setValue(fieldName, cleanedNumber as any);
        }
      } finally {
        phoneState.isProcessing = false;
      }
    },
    [setValue, fieldName, cleanPhoneNumber, phoneState],
  );

  const handleItiInit = useCallback((obj: IntlTelInputRef) => {
    /*console.log('handleItiInit called with:', {
      input: obj.getInput(),
      instance: obj.getInstance(),
      intlTelRef: intlTelRef.current,
    });*/
    const { value } = obj?.getInput() || {};
    const { dialCode } = obj?.getInstance()?.getSelectedCountryData() || {};
    if (value && dialCode) {
      const input = obj?.getInput();
      if (input) {
        input.value = cleanPhoneNumber(value, dialCode);
      }
    }
    intlTelRef.current = obj;
  }, []);

  const validatePhone = useCallback(
    (value: string) => {
      // console.log('validatePhone called with:', value);
      if (!value) return t("ERRORS.PHONE_REQUIRED");

      const instance = intlTelRef.current?.getInstance();
      if (!instance) return t("ERRORS.INVALID_PHONE");

      const countryData = instance.getSelectedCountryData();

      let numberToValidate = value;

      if (!value.startsWith("+") && countryData?.dialCode) {
        numberToValidate = `+${countryData.dialCode}${value}`;
      }

      const isValid = utils.isValidNumber(numberToValidate, countryData?.iso2);
      return isValid || t("ERRORS.INVALID_PHONE");
    },
    [t],
  );

  const setPhoneNumber = useCallback(
    (phoneNumber: string) => {
      //  console.log('setPhoneNumber called with:', phoneNumber);
      const instance = intlTelRef.current?.getInstance();
      if (!instance || phoneState.isProcessing) return;

      phoneState.isProcessing = true;

      try {
        instance.setNumber(phoneNumber);

        setTimeout(() => {
          const countryData = instance.getSelectedCountryData();
          const fullNumber = instance.getNumber();

          if (
            fullNumber &&
            utils.isValidNumber(fullNumber, countryData?.iso2)
          ) {
            phoneState.lastValidNumber = fullNumber;
            phoneState.lastCountryCode = countryData?.dialCode || "";
            console.log("setPhoneNumber: Valid full number:", fullNumber);
            setValue(fieldName, fullNumber as any);
          } else {
            const cleanedNumber = cleanPhoneNumber(
              phoneNumber,
              countryData?.dialCode,
            );
            console.log("setPhoneNumber: Cleaned number:", cleanedNumber);
            setValue(fieldName, cleanedNumber as any);
          }

          phoneState.isProcessing = false;
        }, 100);
      } catch (error) {
        phoneState.isProcessing = false;
        console.error("Error setting phone number:", error);
      }
    },
    [setValue, fieldName, cleanPhoneNumber, phoneState],
  );

  const getFormattedPhone = useCallback(() => {
    // console.log('getFormattedPhone called');
    const instance = intlTelRef.current?.getInstance();
    const number = instance?.getNumber();

    return number && number !== "" ? number : phoneState.lastValidNumber;
  }, [phoneState]);

  const getLocalNumber = useCallback(() => {
    const instance = intlTelRef.current?.getInstance();
    const countryData = instance?.getSelectedCountryData();
    const fullNumber = instance?.getNumber();

    if (fullNumber && countryData?.dialCode) {
      return cleanPhoneNumber(fullNumber, countryData.dialCode);
    }

    return "";
  }, [cleanPhoneNumber]);

  return {
    intlTelRef,
    handlePhoneChange,
    handleItiInit,
    validatePhone,
    setPhoneNumber,
    getFormattedPhone,
    getLocalNumber,
  };
};
