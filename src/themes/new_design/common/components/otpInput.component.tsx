import React, { useState, forwardRef, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh"; // Or any other icon you prefer

import {
  Box,
  CircularProgress,
  IconButton,
  TextFieldProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./otpInput.component.scss";

import checkedImg from "../../../../assets/img/forms/otp-done.svg";
import { TextInput, TextInputProps } from "./TextInput.component";
import { QueryResultSelectorResult } from "@reduxjs/toolkit/query";
import { Dayjs } from "dayjs";

type OtpInputProps = {
  input?: TextInputProps;
  btnLabel: string;
  resendLabel: string;
  extraLinnk?: string;
  isChecked?: boolean;
  isSubmitting?: boolean;
  startCountdown?: boolean;
  countNumbers?: number;
  request?: QueryResultSelectorResult<any>;
  onExtraLinkClick?: () => void;
  onResend?: () => void;
  onSubmit: (otp: string) => void;
};

export const OtpInputComponent = forwardRef<HTMLInputElement, OtpInputProps>(
  (
    {
      input,
      btnLabel,
      isChecked,
      resendLabel,
      extraLinnk,
      countNumbers,
      isSubmitting,
      startCountdown,
      onExtraLinkClick,
      onResend,
      onSubmit,
    },
    ref,
  ) => {
    const [inProgress, setInProgress] = useState(isSubmitting || false);
    const [countnumbers] = useState(countNumbers || 5); // Default to 6 if not provided
    const { t } = useTranslation();
    const [countdown, setCountdown] = useState(0);
    const [otp, setOtp] = useState<Dayjs | string>("");

    useEffect(() => {
      if (countdown > 0) {
        setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      }
    }, [countdown]);

    useEffect(() => {
      if (startCountdown) {
        console.log("start countdown");
        setCountdown(90);
      }
    }, []);
    // ...existing code...
    useEffect(() => {
      if (input?.useDatePicker) {
        const onChange = input.useDatePicker.onChange;
        input.useDatePicker.onChange = (newValue: Dayjs | null) => {
          if (newValue && newValue.isValid() && newValue.year() > 1900) {
            console.log(`valid OTP: ${newValue}`);
            setOtp(newValue);
          } else {
            console.log(`invalid OTP: ${newValue}`);
          }
          // Call onChange with single argument (Dayjs | null)
          onChange?.(newValue);
        };
      }
    }, [input?.useDatePicker]);
    // ...existing code...
    useEffect(() => {
      if (typeof otp === "object" && otp.isValid()) {
        setInProgress(true);
        onSubmit(otp.toString());
        console.log(`Submitting OTP: ${otp}`);
      }
    }, [otp]);

    useEffect(() => {
      console.log(`isSubmitting: ${isSubmitting}`);

      setInProgress(!!isSubmitting);
    }, [isSubmitting]);

    const resend = () => {
      setCountdown(90);
      onResend && onResend();
    };

    const handleDayjsChange = (dayjsValue: Dayjs) => {
      if (!dayjsValue) {
        console.log("Dayjs value is null, resetting");

        return;
      }

      if (!dayjsValue.isValid()) {
        console.log(
          "Dayjs value is invalid:",
          dayjsValue,
          input?.value,
          input?.useDatePicker?.value,
        );
        return;
      }

      const formattedDate = `${dayjsValue.date()}/${dayjsValue.month() + 1}/${dayjsValue.year()}`;

      setOtp(dayjsValue);

      // Always pass Dayjs object back to component
      if (input?.onChange) {
        console.log(
          `OTP input changed: ${formattedDate}`,
          dayjsValue,
          input.value,
          input.useDatePicker?.value,
        );
        input.onChange(dayjsValue as any);
      }

      // Check date completeness before sending
      const dateParts = formattedDate.split("/");
      if (
        dateParts.length === 3 &&
        dateParts[0].length >= 1 &&
        dateParts[1].length >= 1 &&
        dateParts[2].length === 4
      ) {
        setInProgress(true);
        onSubmit(formattedDate);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      input?.onChange?.(e);
      setOtp(e.target?.value);
      console.log(`OTP input changed: ${e.target?.value}`);

      if (e.target?.value.length === countnumbers) {
        setInProgress(true);
        onSubmit(e.target.value);
      }
    };

    return (
      <Box className="otp-input">
        <TextInput
          {...input}
          onChange={
            (input?.useDatePicker ? handleDayjsChange : handleChange) as
              | ((event: React.ChangeEvent<HTMLInputElement>) => void)
              | undefined
          }
          ref={ref}
          variant="outlined"
          disabled={isSubmitting || input?.disabled}
        />

        {!input?.useDatePicker ? (
          <Box className="otp-input__actions">
            {inProgress ? (
              <CircularProgress size={24} className="otp-input__spinner" />
            ) : !isChecked && countdown == 0 ? (
              <IconButton
                color="primary"
                aria-label={btnLabel}
                onClick={() => resend()}
                className="otp-input__icon-button"
              >
                <RefreshIcon />
              </IconButton>
            ) : !isChecked && countdown > 0 ? (
              <span className="otp-input__countdown">
                {`${countdown}s`}
                {/*t("MFA.VERIFICATION_INPUT.SECOND_LEFT", { seconds: countdown })*/}
              </span>
            ) : isChecked ? (
              <img src={checkedImg} className="otp-input__checked" />
            ) : (
              <> </>
            )}
          </Box>
        ) : null}
        {extraLinnk && onExtraLinkClick && (
          <a onClick={onExtraLinkClick} style={{ textAlign: "start" }}>
            {extraLinnk}
          </a>
        )}
      </Box>
    );
  },
);

OtpInputComponent.displayName = "OtpInputComponent";
