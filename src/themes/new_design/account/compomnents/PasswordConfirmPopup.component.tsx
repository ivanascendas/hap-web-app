import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";
import "./PasswordConfirmPopup.component.scss";

export type PasswordConfirmPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

export const PasswordConfirmPopupComponent = ({
  open,
  onClose,
  onConfirm,
}: PasswordConfirmPopupProps): JSX.Element => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm(password);
      setPassword("");
      setShowPassword(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="personal_box otp-popup password-confirm-popup">
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 0, top: 0, color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h2" className="password-confirm-popup__title">
          {t("ACCOUNT.CONFIRM_PASSWORD_TITLE")}
        </Typography>

        <Typography className="password-confirm-popup__subtitle">
          {t("ACCOUNT.CONFIRM_PASSWORD_SUBTITLE")}
        </Typography>

        <Box className="password-confirm-popup__field">
          <label htmlFor="confirm-password-input">{t("LABELS.PASSWORD")}</label>
          <TextField
            id="confirm-password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            autoFocus
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box className="password-confirm-popup__actions">
          <button
            className="btn-primary"
            disabled={!password.trim()}
            onClick={handleConfirm}
          >
            {t("BUTTONS.CONTINUE")}
          </button>
        </Box>
      </Box>
    </Modal>
  );
};
