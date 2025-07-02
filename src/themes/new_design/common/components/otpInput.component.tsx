import React, { useState, forwardRef, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh"; // Or any other icon you prefer

import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./otpInput.component.scss";

import checkedImg from "../../../../assets/img/forms/otp-done.svg";
import { TextInput, TextInputProps } from "./TextInput.component";
import { QueryResultSelectorResult } from "@reduxjs/toolkit/query";
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
    const [otp, setOtp] = useState("");

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

    useEffect(() => {
      if (input?.useDatePicker?.value?.isValid()) {
        setInProgress(true);
        //onSubmit(input?.useDatePicker?.value?.toString() || "");
        console.log(`Submitting OTP: ${otp}`);
      }
    }, [input?.useDatePicker?.value]);

    useEffect(() => {
      console.log(`isSubmitting: ${isSubmitting}`);

      setInProgress(!!isSubmitting);
    }, [isSubmitting]);

    const resend = () => {
      setCountdown(90);
      onResend && onResend();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`OTP input changed: ${e.target.value}`);
      input?.onChange?.(e);
      setOtp(e.target.value);

      if (e.target.value.length === countnumbers) {
        setInProgress(true);
        onSubmit(e.target.value);
      }
    };

    return (
      <Box className="otp-input">
        <TextInput
          {...input}
          onChange={handleChange}
          ref={ref}
          variant="outlined"
          disabled={isSubmitting || input?.disabled}
        />

        {!input?.useDatePicker && !isChecked ? (
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
