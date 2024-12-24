import { Box, Button, Modal, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OtpInputComponent } from "./otpInput.component";
import { MFAMethod } from "../dtos/user.dto";
import {
  usePhoneConfirmationMutation,
  useEmailConfirmationMutation,
} from "../services/Auth.service";

export type VerificationInputProps = {
  isChecked: boolean;
  type: MFAMethod;
  onClose?: () => void;
  onSendOtp?: () => void;
  onConfirm?: (otp: string) => void;
};

export const VerificationInputComponent = ({
  type,
  isChecked,
  onConfirm,
  onSendOtp,
}: VerificationInputProps): JSX.Element => {
  const { t } = useTranslation();
  const [isSent, setIsSent] = useState<boolean>(false);

  const sendHandler = () => {
    if (onSendOtp) {
      onSendOtp();
    }
    setIsSent(true);
  };

  const sendConfirmationHandler = (otp: string) => {
    if (onConfirm) {
      onConfirm(otp);
    }
  };

  return (
    <Box>
      {!isSent ? (
        <Box className="otp-popup_send-box">
          {type === "SMS" && (
            <Typography variant="h6" component="label">
              {" "}
              {t("MFA.VERIFICATION_INPUT.PHONE_INPUT_LABEL")}{" "}
            </Typography>
          )}
          {type === "Email" && (
            <Typography variant="h6" component="label">
              {" "}
              {t("MFA.VERIFICATION_INPUT.EMAIL_INPUT_LABEL")}{" "}
            </Typography>
          )}
          <Button className="button-primary" onClick={sendHandler}>
            {" "}
            {t("MFA.SEND_OTP")}{" "}
          </Button>
        </Box>
      ) : (
        <Box className="otp-popup_confirm-box">
          {type === "SMS" && (
            <Typography variant="h6" component="label">
              {" "}
              {t("MFA.VERIFICATION_INPUT.PHONE_INPUT_SENT_LABEL")}{" "}
            </Typography>
          )}
          {type === "Email" && (
            <Typography variant="h6" component="label">
              {" "}
              {t("MFA.VERIFICATION_INPUT.EMAIL_INPUT_SENT_LABEL")}{" "}
            </Typography>
          )}

          <OtpInputComponent
            isChecked={isChecked}
            startCountdown={true}
            btnLabel={t("BUTTONS.CHECK")}
            resendLabel={t("MFA.VERIFICATION_INPUT.RESEND_OTP")}
            onResend={sendHandler}
            onSubmit={sendConfirmationHandler}
          />
        </Box>
      )}
    </Box>
  );
};
