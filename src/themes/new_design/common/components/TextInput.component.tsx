import { TextField, TextFieldProps } from "@mui/material";
import "./TextInput.component.scss";
import React, { forwardRef, useState } from "react";
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
    const { type, useDatePicker, variant, ...otherProps } = props;
    const modifiedProps = {
      ...otherProps,
      variant: variant || "outlined",
      // Only mark as required in the DOM if truly empty
      //  required: hasValue ? false : props.required,
    };

    return useDatePicker ? (
      <div className={`text-input-container text-input-date`}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            {...useDatePicker}
            slotProps={{
              textField: {
                ...modifiedProps,
                variant: "outlined",
                className: "text-input-date",
                type: "date",
                inputRef: ref,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                  },
                },
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
