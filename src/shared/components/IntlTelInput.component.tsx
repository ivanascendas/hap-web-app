import React, {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import "intl-tel-input/build/css/intlTelInput.min.css";
import intlTelInput, { Iti, SomeOptions } from "intl-tel-input";
import {
  Box,
  FormControl,
  FormHelperText,
  TextFieldProps,
} from "@mui/material";
import { Form } from "react-router-dom";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
export enum TTI_ERROR_CODES {
  IS_POSSIBLE, // Number length is valid
  INVALID_COUNTRY_CODE, // No country matching the country code
  TOO_SHORT, // Number is shorter than the minimum length
  TOO_LONG, // Number is longer than the maximum length
  INVALID_LENGTH, // Number length is not valid for this country
  NOT_A_NUMBER, // Input contains invalid characters
}

interface IntlTelInputProps extends TextFieldProps<"standard"> {
  options?: SomeOptions;
  getIti: (iti: Iti) => void;
  onValidation?: (isValid: boolean, errorCode?: TTI_ERROR_CODES) => void;
}

export const IntlTelInputComponent = forwardRef<
  HTMLInputElement,
  IntlTelInputProps
>((props: IntlTelInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const refRef = useRef<HTMLInputElement>(null);
  const [iniTelReff, setIti] = useState<Iti>();

  useEffect(() => {
    if (refRef && typeof refRef === "object" && refRef.current) {
      try {
        const iti = intlTelInput(refRef.current, {
          ...props.options,
          utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
        });

        const handleOnNumberChange = (e: Event) => {
          if (props.onValidation && iti) {
            const isValid = iti.isValidNumber() || false;
            const errorCode = isValid ? -1 : iti.getValidationError();
            //console.log('isValid:', isValid, 'errorCode:', errorCode, 'phone:', iti.getNumber());
            if (props.onValidation) {
              props.onValidation(
                isValid,
                errorCode > 0 ? errorCode : undefined,
              );
            }
          }
          if (props.onChange) {
            props.onChange({
              target: { value: iti.getNumber() },
            } as React.ChangeEvent<HTMLInputElement>);
          }
          refRef.current?.blur();
          refRef.current?.focus();
        };
        if (iti) {
          setIti(iti);
          props.getIti(iti);

          refRef.current.addEventListener("input", handleOnNumberChange);

          refRef.current.addEventListener(
            "countrychange",
            handleOnNumberChange,
          );
          return () => {
            refRef.current?.removeEventListener("input", handleOnNumberChange);
            refRef.current?.removeEventListener(
              "countrychange",
              handleOnNumberChange,
            );
          };
        }
      } catch (error) {
        console.log("IntlTelInput initialization error:", error);
      }
    }
  }, [refRef.current]);

  useImperativeHandle(ref, () => {
    const input = refRef.current as HTMLInputElement;

    return {
      ...input,
      get value() {
        const val = iniTelReff?.getNumber() || input.value;
        //  console.log('get value:', val);
        return val;
      },
      set value(val: string) {
        // console.log('set value:', val);
        if (iniTelReff) {
          iniTelReff.setNumber(val);
        } else {
          input.value = val;
        }
      },
    };
  });

  const {
    options,
    getIti,
    onValidation,
    label,
    error,
    helperText,
    ...inputProps
  } = props;

  return (
    <FormControl fullWidth>
      <TextField {...inputProps} inputRef={refRef} />
    </FormControl>
  );
});

IntlTelInputComponent.displayName = "IntlTelInputComponent";
