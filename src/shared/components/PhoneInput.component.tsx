import React from "react";
import { TextInput } from "@components/common/components/TextInput.component";
import { IntlTelInputComponent } from "@shared/components/IntlTelInput.component";
import { usePhoneInput } from "@shared/hooks/usePhoneInput";
import { UseFormRegister, FieldError } from "react-hook-form";
import { getErrorMessage } from "@shared/utils/getErrorMessage";

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
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  register,
  error,
  setValue,
  fieldName = "Phone",
  initialCountry = "ie",
  required = false,
  id = "phone-input",
}: PhoneInputProps): JSX.Element => {
  const { handlePhoneChange, handleItiInit, validatePhone } = usePhoneInput(
    setValue,
    fieldName,
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
