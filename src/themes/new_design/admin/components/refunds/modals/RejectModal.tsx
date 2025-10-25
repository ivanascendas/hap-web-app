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
import { Cancel } from "@mui/icons-material";
import { useRejectApplicationByLevelMutation } from "@shared/services/Refunds.service";

/**
 * Props for RejectModal component
 */
export interface RejectModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Application ID to reject
   */
  applicationId: string;

  /**
   * Rejection level (1, 2, or 3)
   */
  level: 1 | 2 | 3;

  /**
   * Callback when modal is closed
   */
  onClose: () => void;

  /**
   * Callback when rejection is successful
   */
  onSuccess?: () => void;
}

/**
 * RejectModal component for rejecting refund applications
 *
 * @component
 * @example
 * ```tsx
 * <RejectModal
 *   open={modalOpen === 'reject'}
 *   applicationId={applicationId}
 *   level={level}
 *   onClose={() => setModalOpen(null)}
 *   onSuccess={() => navigate('/admin/refunds')}
 * />
 * ```
 */
export const RejectModal: React.FC<RejectModalProps> = ({
  open,
  applicationId,
  level,
  onClose,
  onSuccess,
}) => {
  const [comment, setComment] = useState("");
  const [rejectApplication, { isLoading }] =
    useRejectApplicationByLevelMutation();

  const handleReject = async () => {
    if (!comment.trim()) {
      return;
    }

    try {
      await rejectApplication({
        applicationId,
        level,
        comment: comment.trim(),
      }).unwrap();

      // Reset state and close
      setComment("");
      onClose();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by customBaseQuery
      console.error("Reject failed:", error);
    }
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  const isValid = comment.trim().length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Cancel color="error" />
          <Typography variant="h6">
            Reject Application (Level {level})
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are about to reject this refund application. This action will set
          the application status to &quot;Rejected&quot; and cannot be easily
          reversed.
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please provide a reason for rejecting this application. This comment
          will be visible to the applicant.
        </Typography>

        <TextField
          label="Rejection Reason"
          multiline
          rows={4}
          fullWidth
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          inputProps={{ maxLength: 500 }}
          helperText={`${comment.length}/500 characters (required)`}
          placeholder="Please explain why this application is being rejected..."
          error={comment.length > 0 && comment.length < 10}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleReject}
          variant="contained"
          color="error"
          disabled={isLoading || !isValid}
          startIcon={isLoading ? <CircularProgress size={20} /> : <Cancel />}
        >
          {isLoading ? "Rejecting..." : "Reject Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
