import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AdminDto } from "@shared/dtos/admins.dtos";
import { useTranslation } from "react-i18next";

export interface BulkReassignConfirmDialogProps {
  open: boolean;
  selectedAdmin: AdminDto | null;
  selectedCount: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const BulkReassignConfirmDialog: React.FC<
  BulkReassignConfirmDialogProps
> = ({
  open,
  selectedAdmin,
  selectedCount,
  isSubmitting = false,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t("REFUNDS.BULK_REASSIGN.CONFIRM_TITLE")}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {t("REFUNDS.BULK_REASSIGN.CONFIRM_BODY", {
            admin: selectedAdmin?.userName || "",
            count: selectedCount,
          })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t("REFUNDS.BULK_REASSIGN.CANCEL")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isSubmitting || !selectedAdmin || selectedCount === 0}
          startIcon={isSubmitting ? <CircularProgress size={18} /> : undefined}
        >
          {t("REFUNDS.BULK_REASSIGN.CONFIRM")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
