import React, { InputHTMLAttributes, useEffect, useRef } from "react";
import "intl-tel-input/build/css/intlTelInput.min.css";
import intlTelInput from "intl-tel-input";

interface IntlTelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  utilsScript?: string;
}

export const IntlTelInput = (props?: IntlTelInputProps): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      intlTelInput(ref.current, {
        initialCountry: "ie",
        separateDialCode: true,
        /*   utilsScript:
          'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js', */
      });
    }
  }, []);
  return <input ref={ref} {...props} />;
};
