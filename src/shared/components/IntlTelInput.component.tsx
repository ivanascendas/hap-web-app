import React, {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import "intl-tel-input/build/css/intlTelInput.min.css";
import intlTelInput, { SomeOptions } from "intl-tel-input";

interface IntlTelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: SomeOptions;
}

export const IntlTelInput = forwardRef<HTMLInputElement, IntlTelInputProps>(
  (props: IntlTelInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const refRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (refRef && typeof refRef === "object" && refRef.current) {
        intlTelInput(refRef.current, {
          ...props.options,
        });
      }
    }, [refRef]);

    useImperativeHandle(ref, () => refRef.current as HTMLInputElement);

    const { options, ...inputProps } = props;

    return <input {...inputProps} ref={refRef} />;
  },
);

IntlTelInput.displayName = "IntlTelInput";
