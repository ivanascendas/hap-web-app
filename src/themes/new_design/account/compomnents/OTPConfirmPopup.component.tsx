import React, { useEffect } from "react";
import { Box, Modal, IconButton, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./OTPConfirmPopup.component.scss";
import { MFAMethod } from "@shared/dtos/user.dto";
import { OTPInputsComponent } from "@shared/components/otp-inputs.component";
export type OTPConfirmPopupProps = {
  open: boolean;
  isChecked: boolean;
  type: MFAMethod;
  onClose?: () => void;
  onSendOtp?: () => void;
  onConfirm?: (otp: string) => void;
};

export const OTPConfirmPopupComponent = ({
  open,
  onClose,
  onConfirm,
  onSendOtp,
}: OTPConfirmPopupProps): JSX.Element => {
  const sendConfirmationHandler = (otp: string) => {
    if (onConfirm) {
      onConfirm(otp);
    }
  };

  useEffect(() => {
    if (open && onSendOtp) {
      onSendOtp();
    }
  }, [open]);

  // console.log({ open, type, isChecked });
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="personal_box otp-popup">
        <Box className="otp-popup__title">
          <Typography component="span">Enter OTP</Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 0,
              top: "0.3rem",
              color: "grey.500",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <OTPInputsComponent length={4} onConfirm={sendConfirmationHandler} />
        <Box className="otp-popup__actions">
          <Button className="btn-primary" onClick={onSendOtp}>
            Update Number
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
