import { Modal } from "@mui/material";
import React from "react";

export type PopupModal = {
  open: boolean;
  children: JSX.Element;
  onClose?: () => void;
  onActive?: () => void;
};
export const PopupModal = ({
  open,
  onClose,
  children,
}: PopupModal): JSX.Element => {
  return (
    <Modal open={open} onClose={onClose}>
      {children}
    </Modal>
  );
};
