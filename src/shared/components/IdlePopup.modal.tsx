import { Box, Button, Modal, Typography } from "@mui/material";
import "./IdlePopup.modal.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { use } from "i18next";
import { useLogoutMutation } from "../services/Auth.service";

export type IdlePopupModal = {
  open: boolean;
  onClose?: () => void;
  onActive?: () => void;
};
export const IdlePopupModal = ({
  open,
  onClose,
}: IdlePopupModal): JSX.Element => {
  const { t } = useTranslation();
  const [time, setTime] = useState(10);

  const [logout, { isLoading }] = useLogoutMutation();
  useEffect(() => {
    if (time === 0) {
      logout().then(() => {
        document.title = "Your session has expired";
        onClose?.();
      });
    } else {
      const interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [time]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="personal_box idle-popup">
        <Typography component="strong" className="idle-popup_title">
          {t("CONTENTS.IDLE", {
            time,
          })}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          className="idle-popup_button"
          onClick={onClose}
        >
          {t("BUTTONS.OK")}
        </Button>
      </Box>
    </Modal>
  );
};
