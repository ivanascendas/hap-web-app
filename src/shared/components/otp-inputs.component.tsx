import React from "react";
import { Box, Button } from "@mui/material";
import "./otp-inputs.component.scss";

export type OTPInputsProps = {
  onConfirm: (code: string) => void;
  length?: number;
};

export const OTPInputsComponent: React.FC<OTPInputsProps> = ({
  onConfirm,
  length = 4,
}: OTPInputsProps): JSX.Element => {
  const [otpCode, setOtpCode] = React.useState<string>("");
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtpCode = otpCode.split("");
    newOtpCode[index] = value;
    setOtpCode(newOtpCode.join(""));

    // Move to next input if value is entered and not at last input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (newOtpCode.join("").length === length) {
      // If all inputs are filled, call onConfirm
      onConfirm(newOtpCode.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box className="otp-inputs__container">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          className="otp-inputs__input"
          inputMode="numeric"
          maxLength={1}
          value={otpCode[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </Box>
  );
};
