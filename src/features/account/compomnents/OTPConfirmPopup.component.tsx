import { Box, Button, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./OTPConfirmPopup.component.scss";
import { MFAMethod } from "../../../shared/dtos/user.dto";
import { OtpInputComponent } from "../../../shared/components/otpInput.component";
export type OTPConfirmPopupProps = {
  open: boolean;
  type: MFAMethod;
  onClose?: () => void;
  onSendOtp?: () => void;
  onConfirm?: (otp: string) => void;
};

export const OTPConfirmPopupComponent = ({
  open,
  type,
  onClose,
  onConfirm,
  onSendOtp,
}: OTPConfirmPopupProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
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
    <Modal open={open} onClose={onClose}>
      <Box className="personal_box otp-popup">
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>

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
              isChecked={false}
              startCountdown={true}
              btnLabel={t("BUTTONS.CHECK")}
              resendLabel={t("MFA.VERIFICATION_INPUT.RESEND_OTP")}
              onResend={sendHandler}
              onSubmit={sendConfirmationHandler}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};
