import { TextField, TextFieldProps } from "@mui/material";
import "./TextInput.component.scss";
import { forwardRef, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";

export type TextInputProps = TextFieldProps & {
  useDatePicker?: DatePickerProps<any>;
};

export const TextInput = forwardRef(
  (props: TextInputProps, ref): JSX.Element => {
    const [showPassword, setShowPassword] = useState(false);

    // Destructure relevant props - use props.type directly in render
    const { type, error, helperText, useDatePicker, ...otherProps } = props;
    const modifiedProps = {
      ...otherProps,
      // Only mark as required in the DOM if truly empty
      //  required: hasValue ? false : props.required,
    };

    return useDatePicker ? (
      <div className={`text-input-container text-input-${type || "text"}`}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            {...useDatePicker}
            slotProps={{
              textField: {
                variant: "outlined",
                className: "text-input-date",
                inputRef: ref,
              },
            }}
          />
        </LocalizationProvider>
      </div>
    ) : (
      <div className={`text-input-container text-input-${type || "text"}`}>
        <TextField
          {...modifiedProps}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          variant="outlined"
          inputRef={ref}
        />
        {type === "password" && (
          <div
            className="password-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
