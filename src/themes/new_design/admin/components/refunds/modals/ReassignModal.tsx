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
  Autocomplete,
  Grid,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";

import { getErrorMessage } from "@shared/utils/getErrorMessage";
import { useGetAdminsQuery } from "@shared/services/Admins.service";
import { useReassignApplicationsMutation } from "@shared/services/Refunds.service";
import { t } from "i18next";
import { Controller } from "react-hook-form";
import { AdminDto } from "@shared/dtos/admins.dtos";

/**
 * Props for ReassignModal component
 */
export interface ReassignModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Application ID to approve
   */
  applicationId: string;

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
 * ReassignModal component for approving refund applications
 *
 * @component
 * @example
 * ```tsx
 * <ReassignModal
 *   open={modalOpen === 'approve'}
 *   applicationId={applicationId}
 *   level={level}
 *   onClose={() => setModalOpen(null)}
 *   onSuccess={() => navigate('/admin/refunds')}
 * />
 * ```
 */
export const ReassignModal: React.FC<ReassignModalProps> = ({
  open,
  applicationId,
  onClose,
  onSuccess,
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminDto | null>(null);
  const [adminInputValue, setAdminInputValue] = useState("");
  const [actionError, setActionError] = useState("");
  const [reassignApplication, { isLoading }] =
    useReassignApplicationsMutation();

  const { data: adminOptions, isFetching } = useGetAdminsQuery();

  const handleReassign = async () => {
    try {
      if (!selectedAdmin) {
        setActionError(t("REFUNDS.ERRORS.SELECT_ADMIN"));
        return;
      }
      const result = await reassignApplication({
        applicationId,
        targetAdminId: selectedAdmin.userName,
      }).unwrap();
      console.log("Reassign result:", result);
      // Reset state and close
      setAdminInputValue("");
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
      console.error("Reassign failed:", error);
    }
  };

  const handleClose = () => {
    setAdminInputValue("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SwapHoriz color="success" />
          <Typography variant="h6">Reassign Application</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This action will reassign the application to the chosen admin in the
          assigned workflow.
        </Typography>

        <Grid size={12}>
          <Autocomplete
            fullWidth
            options={
              adminOptions?.filter((s) =>
                s.roles.some(
                  (r) => r === "DMU_L1" || r === "DMU_L2" || r === "AP",
                ),
              ) || []
            }
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.userName} - ${option.roles.join(", ")}`
            }
            loading={isFetching}
            value={
              selectedAdmin ||
              adminOptions?.find(
                (c) => c.userName.toString() === adminInputValue,
              ) ||
              null
            }
            onChange={(_, newValue) => {
              setSelectedAdmin(newValue);
            }}
            onInputChange={(_, newInputValue) => {
              setAdminInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("REFUNDS.FORM.CHOOSE_ADMIN")}
                placeholder={
                  t("REFUNDS.FORM.CHOOSE_ADMIN_PLACEHOLDER") ||
                  "Type to search..."
                }
              />
            )}
          />
        </Grid>
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
          onClick={handleReassign}
          variant="contained"
          color="success"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <SwapHoriz />}
        >
          {isLoading ? "Reassigning..." : "Reassign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
