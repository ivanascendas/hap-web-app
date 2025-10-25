import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  SelectChangeEvent,
  Paper,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { RefundApplicationDto } from "@shared/dtos/refund.dtos";
import type { VerifyBshResponse } from "@shared/dtos/refund.dtos";
import { BshComparisonTableComponent } from "./BshComparisonTableComponent";

interface BshComparisonComponentProps {
  title: string;
  onClose: () => void;
  onConfirm: (selectedStatus: string) => void;
  application: RefundApplicationDto | null;
  bshResult: VerifyBshResponse | null;
  isLoading?: boolean;
}

export const BshComparisonComponent: React.FC<BshComparisonComponentProps> = ({
  title,
  onConfirm,
  application,
  bshResult,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  return (
    <Paper sx={{ p: 2, mb: 3, height: "calc(100vh - 30rem)" }}>
      <Box>
        <Typography variant="h6">BSH Verification - {title}</Typography>
      </Box>
      <Box>
        <BshComparisonTableComponent
          application={application}
          bshResult={bshResult}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
        />
      </Box>
      <Box sx={{ p: 2, gap: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={isLoading || bshResult === null || selectedStatus === ""}
        >
          {isLoading ? t("COMMON.CONFIRM") : t("COMMON.CONFIRM")}
        </Button>
      </Box>
    </Paper>
  );
};
