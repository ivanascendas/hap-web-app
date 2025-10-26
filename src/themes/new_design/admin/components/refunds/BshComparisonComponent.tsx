import React, { useState } from "react";
import {
  Button,
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
  handleLopRequirementChange?: (isRequired: boolean) => void;
  application: RefundApplicationDto | null;
  bshResult: VerifyBshResponse | null;
  isLoading?: boolean;
}

export const BshComparisonComponent: React.FC<BshComparisonComponentProps> = ({
  title,
  onConfirm,
  application,
  handleLopRequirementChange,
  bshResult,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [lopRequirement, setLopRequirement] = useState<boolean>(
    application?.jointTenancy || false,
  );

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirm = (status: string) => {
    onConfirm(status);
    if (application?.jointTenancy !== lopRequirement) {
      console.log("LOP Requirement on confirm:", lopRequirement);
      handleLopRequirementChange?.(lopRequirement);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        height: "calc(100vh - 22rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: "none" }}>
        <Typography variant="h6">BSH Verification - {title}</Typography>
      </Box>
      <Box>
        <BshComparisonTableComponent
          application={application}
          bshResult={bshResult}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
          lopRequirementChange={setLopRequirement}
        />
      </Box>
      <Box
        sx={{
          gap: 1,
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "end",
        }}
      >
        <Button
          onClick={() => handleConfirm("INVALID")}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {t("REFUNDS.STATUS_INVALID")}
        </Button>
        <Button
          onClick={() => handleConfirm("VALID")}
          variant="contained"
          color="primary"
          disabled={
            isLoading || bshResult === null || selectedStatus !== "VALID"
          }
        >
          {t("REFUNDS.STATUS_VALID")}
        </Button>
      </Box>
    </Paper>
  );
};
