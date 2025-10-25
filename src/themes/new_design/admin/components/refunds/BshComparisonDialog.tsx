import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { RefundApplicationDto } from "@shared/dtos/refund.dtos";
import type { VerifyBshResponse } from "@shared/dtos/refund.dtos";
import { BshComparisonTableComponent } from "./BshComparisonTableComponent";

interface BshComparisonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedStatus: string) => void;
  application: RefundApplicationDto | null;
  bshResult: VerifyBshResponse | null;
  isLoading?: boolean;
}

export const BshComparisonDialog: React.FC<BshComparisonDialogProps> = ({
  open,
  onClose,
  onConfirm,
  application,
  bshResult,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string>("VALID");
  const [matchStates, setMatchStates] = useState<{ [key: number]: boolean }>(
    {},
  );

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  const handleCancel = () => {
    setSelectedStatus("VALID");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">BSH Verification - Compare Data</Typography>
      </DialogTitle>
      <DialogContent>
        <BshComparisonTableComponent
          application={application}
          bshResult={bshResult}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleCancel} variant="outlined" disabled={isLoading}>
          {t("BUTTONS.CANCEL")}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? t("COMMON.CONFIRM") : t("COMMON.CONFIRM")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
