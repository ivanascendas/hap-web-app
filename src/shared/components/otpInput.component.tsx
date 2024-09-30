import React, { useState, forwardRef, useEffect } from "react";

import Grid from "@mui/material/Grid2";
import { TextField, TextFieldProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./otpInput.component.scss";

import checkedImg from "../../assets/img/forms/otp-done.svg";
type OtpInputProps = {
  input?: TextFieldProps;
  btnLabel: string;
  resendLabel: string;
  isChecked?: boolean;
  onResend: () => void;
  onSubmit: (otp: string) => void;
};

export const OtpInputComponent = forwardRef<HTMLInputElement, OtpInputProps>(
  ({ input, btnLabel, isChecked, resendLabel, onResend, onSubmit }, ref) => {
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

    const resend = () => {
      setCountdown(90);
      onResend();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      input?.onChange?.(e);
      setOtp(e.target.value);
    };

    return (
      <Grid container spacing={0} className="otp-input">
        <Grid size={8}>
          <TextField {...input} onChange={handleChange} ref={ref} />
        </Grid>
        <Grid size={4}>
          {isChecked ? (
            <img src={checkedImg} className="otp-input__checked" />
          ) : (
            <button className="otp-input__button" onClick={() => onSubmit(otp)}>
              {btnLabel}
            </button>
          )}
        </Grid>
        <Grid size={8}>
          {countdown > 0 && (
            <span>
              {t("MFA.VERIFICATION_INPUT.SECOND_LEFT", { seconds: countdown })}
            </span>
          )}
        </Grid>
        <Grid size={4}>
          {countdown == 0 && !isChecked && (
            <a onClick={resend}>{resendLabel}</a>
          )}
        </Grid>
      </Grid>
    );
  },
);

OtpInputComponent.displayName = "OtpInputComponent";
