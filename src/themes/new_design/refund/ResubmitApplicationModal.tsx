import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { RefundApplicationDto } from "@shared/dtos/refund.dtos";
import { useSubmitApplicationMutation } from "@shared/services/Refunds.service";

interface ResubmitApplicationModalProps {
  open: boolean;
  onClose: () => void;
  application: RefundApplicationDto;
}

export const ResubmitApplicationModal: React.FC<
  ResubmitApplicationModalProps
> = ({ open, onClose, application }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [refundReason, setRefundReason] = useState("");
  const [jointTenancy, setJointTenancy] = useState(false);
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [error, setError] = useState<string>("");

  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();

  // Initialize form with application data
  useEffect(() => {
    if (application) {
      setRefundReason(application.refundReason || "");
      setJointTenancy(application.jointTenancy || false);
      setIban(application.iban || "");
      setBic(application.bic || "");
    }
  }, [application]);

  const handleSubmit = async () => {
    // Basic validation
    if (!refundReason.trim()) {
      setError(t("ERRORS.REQUIRED"));
      return;
    }

    if (!iban.trim()) {
      setError(t("ERRORS.REQUIRED"));
      return;
    }

    try {
      // Create updated application object
      const updatedApplication: RefundApplicationDto = {
        ...application,
        refundReason: refundReason.trim(),
        jointTenancy,
        iban: iban.trim(),
        bic: bic.trim(),
      };

      await submitApplication(updatedApplication).unwrap();

      // Reset and close
      setError("");
      onClose();
    } catch {
      setError(t("ERRORS.SERVER_ERROR"));
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>{t("REFUNDS.RESUBMIT.TITLE")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label={t("REFUNDS.RESUBMIT.REFUND_REASON")}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            multiline
            rows={3}
            required
            error={!refundReason.trim() && error !== ""}
          />

          <TextField
            fullWidth
            label={t("REFUNDS.RESUBMIT.IBAN")}
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            required
            error={!iban.trim() && error !== ""}
            placeholder="IE29AIBK93115212345678"
          />

          <TextField
            fullWidth
            label={t("REFUNDS.RESUBMIT.BIC")}
            value={bic}
            onChange={(e) => setBic(e.target.value)}
            placeholder="AIBKIE2D"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={jointTenancy}
                onChange={(e) => setJointTenancy(e.target.checked)}
              />
            }
            label={t("REFUNDS.RESUBMIT.JOINT_TENANCY")}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          {isLoading && <LinearProgress />}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: isMobile ? "column-reverse" : "row",
          gap: isMobile ? 1 : 0,
          px: isMobile ? 2 : 3,
          pb: isMobile ? 2 : 1,
        }}
      >
        <Button onClick={handleClose} disabled={isLoading} fullWidth={isMobile}>
          {t("BUTTONS.CANCEL")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth={isMobile}
        >
          {t("BUTTONS.SEND")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
