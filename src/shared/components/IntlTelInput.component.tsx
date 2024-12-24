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
import { Iti, SomeOptions } from "intl-tel-input";
import IntlTelInput, { IntlTelInputRef } from "intl-tel-input/react";
export enum TTI_ERROR_CODES {
  IS_POSSIBLE, // Number length is valid
  INVALID_COUNTRY_CODE, // No country matching the country code
  TOO_SHORT, // Number is shorter than the minimum length
  TOO_LONG, // Number is longer than the maximum length
  INVALID_LENGTH, // Number length is not valid for this country
  NOT_A_NUMBER, // Input contains invalid characters
}

interface IntlTelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: SomeOptions;
  getIti?: (iti: IntlTelInputRef) => void;
  onValidation?: (isValid: boolean, errorCode?: TTI_ERROR_CODES) => void;
}

export const IntlTelInputComponent = forwardRef<
  HTMLInputElement,
  IntlTelInputProps
>((props: IntlTelInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const refRef = useRef<HTMLInputElement>(null);
  const [iniTelReff, setIti] = useState<Iti>();
  const itiInputfRef = useRef<IntlTelInputRef>(null);

  const { options, getIti, onValidation, ...inputProps } = props;

  /*
    const handleOnNumberChange = (e: Event) => {
      if (props.onValidation && iniTelReff) {
        const isValid = iniTelReff.isValidNumber() || false;
        const errorCode = isValid ? -1 : iniTelReff.getValidationError();
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
          target: { value: iniTelReff?.getNumber() },
        } as React.ChangeEvent<HTMLInputElement>);
      }
      refRef.current?.blur();
      refRef.current?.focus();
    };
  
    useEffect(() => {
      if (refRef && typeof refRef === "object" && refRef.current) {
        try {
          const iti = intlTelInput(refRef.current, {
            ...props.options,
            utilsScript:
              "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
          });
  
  
          if (iti && props.getIti) {
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
  */

  useImperativeHandle(ref, () => {
    const input = refRef.current as HTMLInputElement;
    return itiInputfRef.current?.getInput() as HTMLInputElement;
    return input
      ? {
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
        }
      : input;
  });

  useEffect(() => {
    if (itiInputfRef.current) {
      if (getIti) {
        getIti(itiInputfRef.current);
      }
      const input = itiInputfRef.current.getInput();
      if (input && props?.onChange) {
        input.addEventListener(
          "input",
          (e) =>
            props?.onChange &&
            props?.onChange(
              e as unknown as React.ChangeEvent<HTMLInputElement>,
            ),
        );
        return () => {
          input.removeEventListener(
            "input",
            (e) =>
              props?.onChange &&
              props?.onChange(
                e as unknown as React.ChangeEvent<HTMLInputElement>,
              ),
          );
        };
      }
    }
  }, [itiInputfRef.current]);

  /* return (
 
     <input  {...inputProps} ref={refRef} />
 
   );*/
  return (
    <IntlTelInput
      initOptions={options}
      inputProps={{ ...inputProps }}
      ref={itiInputfRef}
    />
  );
});

IntlTelInputComponent.displayName = "IntlTelInputComponent";
