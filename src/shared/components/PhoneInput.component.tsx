import React, { useEffect } from "react";
import { TextInput } from "@components/common/components/TextInput.component";
import { IntlTelInputComponent } from "@shared/components/IntlTelInput.component";
import { PhoneData, usePhoneInput } from "@shared/hooks/usePhoneInput";
import { UseFormRegister, FieldError } from "react-hook-form";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import "./PhoneInput.component.scss";

export type PhoneInputProps = {
  register: UseFormRegister<any>;
  error?: FieldError;
  slotProps?: any;
  setValue: any;
  fieldName?: string;
  initialCountry?: string;
  label?: string;
  required?: boolean;
  id?: string;
  getPhoneDataCallback?: (callback: () => PhoneData) => void;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  register,
  error,
  setValue,
  fieldName = "Phone",
  initialCountry = "ie",
  required = false,
  id = "phone-input",
  getPhoneDataCallback,
}: PhoneInputProps): JSX.Element => {
  const { handlePhoneChange, handleItiInit, validatePhone } = usePhoneInput(
    setValue,
    fieldName,
    getPhoneDataCallback,
  );

  return (
    <TextInput
      id={id}
      error={!!error}
      helperText={getErrorMessage(error?.message)}
      slotProps={{
        htmlInput: {
          "aria-invalid": !!error,
        },
        input: {
          inputComponent: IntlTelInputComponent,
          inputProps: {
            options: {
              initialCountry,
              separateDialCode: true,
              formatOnDisplay: true,
              formatAsYouType: true,
            },
            getIti: handleItiInit,
            onChange: handlePhoneChange,
          },
        },
      }}
      {...register(fieldName, {
        required,
        validate: validatePhone,
      })}
    />
  );
};
