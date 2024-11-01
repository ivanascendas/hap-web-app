import React, {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "intl-tel-input/build/css/intlTelInput.min.css";
import intlTelInput, { Iti, SomeOptions } from "intl-tel-input";

interface IntlTelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: SomeOptions;
  getIti: (iti: Iti) => void;
}

export const IntlTelInput = forwardRef<HTMLInputElement, IntlTelInputProps>(
  (props: IntlTelInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const refRef = useRef<HTMLInputElement>(null);
    const [iniTelReff, setIti] = useState<Iti>();
    useEffect(() => {
      if (refRef && typeof refRef === "object" && refRef.current) {
        const iti = intlTelInput(refRef.current, {
          ...props.options,
        })
        setIti(iti);
        props.getIti(iti);
      }
    }, [refRef]);

    useImperativeHandle(ref, () => refRef.current as HTMLInputElement);

    const { options, ...inputProps } = props;

    return <input {...inputProps} ref={refRef} aria-invalid={iniTelReff?.isValidNumber() || false} />;
  },
);

IntlTelInput.displayName = "IntlTelInput";
