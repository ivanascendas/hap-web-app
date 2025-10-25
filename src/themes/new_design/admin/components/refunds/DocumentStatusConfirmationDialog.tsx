import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useConfirmDocumentStatusMutation } from "@shared/services/Refunds.service";
import { toast } from "react-toastify";

export interface DocumentStatusConfirmationDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog should close
   */
  onClose: () => void;

  /**
   * Refund application ID
   */
  applicationId: string;

  /**
   * Document ID to confirm
   */
  documentId: string;

  /**
   * Current document status (optional)
   */
  currentStatus?: string;
}

/**
 * Dialog component for confirming document status as VALID or INVALID
 * Admin-only functionality (roles: DMU, AP, Admin)
 */
export const DocumentStatusConfirmationDialog: React.FC<
  DocumentStatusConfirmationDialogProps
> = ({ open, onClose, applicationId, documentId, currentStatus }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"VALID" | "INVALID">("VALID");
  const [comment, setComment] = useState("");

  const [confirmStatus, { isLoading, error }] =
    useConfirmDocumentStatusMutation();

  const handleConfirm = async () => {
    try {
      const result = await confirmStatus({
        applicationId,
        documentId,
        status,
        comment,
      }).unwrap();

      toast.success(
        t("REFUNDS.DOCUMENT_STATUS_CONFIRMED", { status: result.status }),
      );
      onClose();
    } catch (err) {
      const error = err as { data?: { detail?: string } };
      toast.error(error?.data?.detail || t("REFUNDS.CONFIRM_STATUS_ERROR"));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setStatus("VALID");
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("REFUNDS.CONFIRM_DOCUMENT_STATUS")}</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {currentStatus && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t("REFUNDS.CURRENT_STATUS")}: {currentStatus}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t("REFUNDS.STATUS")}</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as "VALID" | "INVALID")}
              disabled={isLoading}
              label={t("REFUNDS.STATUS")}
            >
              <MenuItem value="VALID">{t("REFUNDS.STATUS_VALID")}</MenuItem>
              <MenuItem value="INVALID">{t("REFUNDS.STATUS_INVALID")}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("REFUNDS.COMMENT")}
            placeholder={t("REFUNDS.ENTER_REASON_FOR_CONFIRMATION")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
          />
        </Box>
      </DialogContent>

      {error ? (
        <Box sx={{ px: 3, pb: 2 }}>
          <Alert severity="error">{t("REFUNDS.ERROR_OCCURRED")}</Alert>
        </Box>
      ) : null}

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          {t("COMMON.CANCEL")}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? t("COMMON.CONFIRMING") : t("COMMON.CONFIRM")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
