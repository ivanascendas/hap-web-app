import React, {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "intl-tel-input/build/css/intlTelInput.min.css";
import intlTelInput, { Iti, SomeOptions } from "intl-tel-input";
import { Box, FormHelperText } from "@mui/material";

export enum TTI_ERROR_CODES {
  IS_POSSIBLE, // Number length is valid
  INVALID_COUNTRY_CODE, // No country matching the country code
  TOO_SHORT, // Number is shorter than the minimum length
  TOO_LONG, // Number is longer than the maximum length
  INVALID_LENGTH, // Number length is not valid for this country
  NOT_A_NUMBER // Input contains invalid characters
};

interface IntlTelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: SomeOptions;
  getIti: (iti: Iti) => void;
  onValidation?: (isValid: boolean, errorCode?: TTI_ERROR_CODES) => void;
}



export const IntlTelInput = forwardRef<HTMLInputElement, IntlTelInputProps>(
  (props: IntlTelInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const refRef = useRef<HTMLInputElement>(null);
    const [iniTelReff, setIti] = useState<Iti>();



    useEffect(() => {
      if (refRef && typeof refRef === "object" && refRef.current) {
        try {
          const iti = intlTelInput(refRef.current, {
            ...props.options,
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
          });

          const handleOnNumberChange = () => {
            if (props.onValidation && iti) {
              const isValid = iti.isValidNumber() || false;
              const errorCode = isValid ? -1 : iti.getValidationError();
              //console.log('isValid:', isValid, 'errorCode:', errorCode, 'phone:', iti.getNumber());
              props.onValidation(isValid, errorCode > 0 ? errorCode : undefined);

            }
          }

          if (iti) {
            console.log('IntlTelInput initialized');
            setIti(iti);
            props.getIti(iti);

            refRef.current.addEventListener('input', handleOnNumberChange);

            refRef.current.addEventListener('countrychange', handleOnNumberChange);
            return () => {
              refRef.current?.removeEventListener('input', handleOnNumberChange);
              refRef.current?.removeEventListener('countrychange', handleOnNumberChange);
            };
          }

        } catch (error) {
          console.log('IntlTelInput initialization error:', error);
        }
      }
    }, [refRef]);


    useImperativeHandle(ref, () => {
      const input = refRef.current as HTMLInputElement;

      return {
        ...input,
        get value() {
          const val = iniTelReff?.getNumber() || input.value;
          console.log('get value:', val);
          return val;
        },
        set value(val: string) {
          console.log('set value:', val);
          if (iniTelReff) {
            iniTelReff.setNumber(val);
          } else {
            input.value = val;
          }
        }
      };
    });


    const { options, getIti, onValidation, ...inputProps } = props;



    return (
      <input
        {...inputProps}
        ref={refRef}
      />
    );
  },
);

IntlTelInput.displayName = "IntlTelInput";