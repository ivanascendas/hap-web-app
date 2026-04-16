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
import { CheckCircle } from "@mui/icons-material";
import { useApproveApplicationByLevelMutation } from "@shared/services/Refunds.service";
import { set } from "date-fns";
import { getErrorMessage } from "@shared/utils/getErrorMessage";

/**
 * Props for ApproveModal component
 */
export interface ApproveModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Application ID to approve
   */
  applicationId: string;

  /**
   * Approval level (1, 2, or 3)
   */
  level: 1 | 2 | 3;

  /**
   * Callback when modal is closed
   */
  onClose: () => void;

  /**
   * Callback when approval is successful
   */
  onSuccess?: () => void;
}

/**
 * ApproveModal component for approving refund applications
 *
 * @component
 * @example
 * ```tsx
 * <ApproveModal
 *   open={modalOpen === 'approve'}
 *   applicationId={applicationId}
 *   level={level}
 *   onClose={() => setModalOpen(null)}
 *   onSuccess={() => navigate('/admin/refunds')}
 * />
 * ```
 */
export const ApproveModal: React.FC<ApproveModalProps> = ({
  open,
  applicationId,
  level,
  onClose,
  onSuccess,
}) => {
  const [comment, setComment] = useState("");
  const [actionError, setActionError] = useState("");
  const [approveApplication, { isLoading }] =
    useApproveApplicationByLevelMutation();

  const handleApprove = async () => {
    try {
      const result = await approveApplication({
        applicationId,
        level,
        comment: comment.trim() || undefined,
      }).unwrap();
      console.log("Approve result:", result);
      // Reset state and close
      setComment("");
      onClose();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by customBaseQuery
      setActionError(
        getErrorMessage(
          (error as any).data?.detail ||
            (error as any).data?.message ||
            "ERRORS.UNKNOWN_ERROR",
        ) || "An unknown error occurred. Please try again.",
      );
      console.error("Approve failed:", error);
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
          <CheckCircle color="success" />
          <Typography variant="h6">
            Approve Application (Level {level})
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You are about to approve this refund application at Level {level}.
          This action will move the application to the next stage in the
          approval workflow.
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
          placeholder="Add any comments or notes about this approval..."
        />
        {actionError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {actionError}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleApprove}
          variant="contained"
          color="success"
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} /> : <CheckCircle />
          }
        >
          {isLoading ? "Approving..." : "Approve"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
