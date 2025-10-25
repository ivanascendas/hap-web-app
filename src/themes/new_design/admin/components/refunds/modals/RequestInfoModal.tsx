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
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRequestInfoFromTenantMutation } from "@shared/services/Refunds.service";

/**
 * Props for RequestInfoModal component
 */
export interface RequestInfoModalProps {
  open: boolean;
  applicationId: string;
  level: 1 | 2;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * RequestInfoModal component for requesting additional information from tenant
 */
export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  open,
  applicationId,
  level,
  onClose,
  onSuccess,
}) => {
  const [comment, setComment] = useState("");
  const [dueBy, setDueBy] = useState<Date | null>(null);
  const [requestInfo, { isLoading }] = useRequestInfoFromTenantMutation();

  const handleRequestInfo = async () => {
    if (!dueBy) return;

    try {
      await requestInfo({
        applicationId,
        level,
        comment: comment.trim() || undefined,
        dueBy: dueBy.toISOString(),
      }).unwrap();

      setComment("");
      setDueBy(null);
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Request info failed:", error);
    }
  };

  const handleClose = () => {
    setComment("");
    setDueBy(null);
    onClose();
  };

  const minDate = new Date();
  const isValid = dueBy && dueBy > minDate;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InfoOutlined color="info" />
          <Typography variant="h6">Request Additional Information</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Request additional information from the tenant. The application will
          be returned to &quot;Returned for Information&quot; status.
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Due By (Required)"
            value={dueBy}
            onChange={(newValue) => {
              // Convert to Date if it's Dayjs or another format
              if (newValue) {
                const dateValue =
                  newValue instanceof Date
                    ? newValue
                    : new Date(newValue.toString());
                setDueBy(dateValue);
              } else {
                setDueBy(null);
              }
            }}
            minDate={minDate}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                sx: { mb: 2 },
              },
            }}
          />
        </LocalizationProvider>

        <TextField
          label="Comment (Optional)"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          inputProps={{ maxLength: 500 }}
          helperText={`${comment.length}/500 characters`}
          placeholder="Specify what information is needed..."
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleRequestInfo}
          variant="contained"
          color="info"
          disabled={isLoading || !isValid}
          startIcon={
            isLoading ? <CircularProgress size={20} /> : <InfoOutlined />
          }
        >
          {isLoading ? "Requesting..." : "Request Info"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
