import { TextField, TextFieldProps } from "@mui/material";
import "./TextInput.component.scss";
import React, { forwardRef, useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export type TextInputProps = TextFieldProps & {
  useDatePicker?: Partial<{
    onChange?: (date: Dayjs | null) => void;
    value?: Dayjs | null;
    [key: string]: unknown;
  }>;
};

export const TextInput = forwardRef(
  (props: TextInputProps, ref): JSX.Element => {
    const [showPassword, setShowPassword] = useState(false);
    const [dateValue, setDateValue] = useState<Dayjs | null>(null);
    // Destructure relevant props - use props.type directly in render
    const { type, useDatePicker, onChange, variant, ...otherProps } = props;
    const modifiedProps = {
      ...otherProps,
      variant: variant || "outlined",
      // Only mark as required in the DOM if truly empty
      //  required: hasValue ? false : props.required,
    };
    useEffect(() => {
      console.log("Date value changed:", dateValue);
      if (dateValue?.isValid()) {
        useDatePicker?.onChange?.(dateValue);
      }
    }, [dateValue, useDatePicker]);
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
            onChange={(date) => {
              console.log("Date value changed:", date);
              // date will be Dayjs | null from AdapterDayjs
              if (date && "isValid" in date) {
                // Check that it's Dayjs
                setDateValue(date as Dayjs);
                if ((date as Dayjs).isValid()) {
                  useDatePicker?.onChange?.(date as Dayjs);
                }
              } else {
                setDateValue(null);
              }
            }}
            value={dateValue}
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
          onChange={onChange}
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
