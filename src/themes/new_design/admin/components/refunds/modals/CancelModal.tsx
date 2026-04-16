import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Block } from "@mui/icons-material";
import { useCancelApplicationByAdminMutation } from "@shared/services/Refunds.service";

/**
 * Props for CancelModal component
 */
export interface CancelModalProps {
  open: boolean;
  applicationId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * CancelModal component for canceling refund applications
 */
export const CancelModal: React.FC<CancelModalProps> = ({
  open,
  applicationId,
  onClose,
  onSuccess,
}) => {
  const [comment, setComment] = useState("");
  const [cancelApplication, { isLoading }] =
    useCancelApplicationByAdminMutation();

  const handleCancel = async () => {
    try {
      await cancelApplication({
        applicationId,
        comment: comment.trim() || undefined,
      }).unwrap();

      setComment("");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Block color="error" />
          <Typography variant="h6">Cancel Application</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are about to cancel this refund application. This action will set
          the application status to &quot;Cancelled&quot;.
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Optionally provide a reason for canceling this application.
        </Typography>

        <TextField
          label="Comment (Optional)"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          inputProps={{ maxLength: 500 }}
          helperText={`${comment.length}/500 characters`}
          placeholder="Provide a reason for cancellation..."
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Close
        </Button>
        <Button
          onClick={handleCancel}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <Block />}
        >
          {isLoading ? "Canceling..." : "Cancel Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
