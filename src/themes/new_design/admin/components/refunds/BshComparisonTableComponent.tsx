import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material";
import type { RefundApplicationDto } from "@shared/dtos/refund.dtos";
import type { VerifyBshResponse } from "@shared/dtos/refund.dtos";
import { MaskedField } from "@shared/components/MaskedField";
import { ConfidenceBadge } from "@shared/components/ConfidenceBadge";

interface BshComparisonTableProps {
  selectedStatus: string;
  handleStatusChange: (event: SelectChangeEvent<string>) => void;
  lopRequirementChange?: (isRequired: boolean) => void;
  application: RefundApplicationDto | null;
  bshResult: VerifyBshResponse | null;
  isLoading?: boolean;
}

interface MatchCheckboxProps {
  appValue: string | null | boolean | undefined;
  bshValue: string | null | boolean | undefined;
  index: number;
  matchStates: { [key: number]: boolean };
  onMatchChange: (index: number, checked: boolean) => void;
}

const MatchCheckbox: React.FC<MatchCheckboxProps> = ({
  appValue,
  bshValue,
  index,
  onMatchChange,
}) => {
  const [isMatch, setIsMatch] = useState<boolean>(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsMatch(checked);
    onMatchChange(index, checked);
  };

  useEffect(() => {
    const normalizedAppValue =
      typeof appValue === "boolean"
        ? appValue.toString()
        : appValue?.trim().toLowerCase() || "";
    const normalizedBshValue =
      typeof bshValue === "boolean"
        ? bshValue.toString()
        : bshValue?.trim().toLowerCase() || "";
    const match =
      typeof appValue === "boolean"
        ? Boolean(appValue)
        : normalizedAppValue === normalizedBshValue;
    setIsMatch(match);
    onMatchChange(index, match);
  }, [appValue, bshValue, index]);

  return (
    <Checkbox
      checked={isMatch}
      onChange={(e) => handleCheckboxChange(e.target.checked)}
      sx={{
        color: isMatch ? "success.main" : "error.main",
        "&.Mui-checked": {
          color: isMatch ? "success.main" : "error.main",
        },
      }}
    />
  );
};

export const BshComparisonTableComponent: React.FC<BshComparisonTableProps> = ({
  application,
  bshResult,
  selectedStatus,
  handleStatusChange,
  lopRequirementChange,
  isLoading = false,
}) => {
  const [matchStates, setMatchStates] = useState<{ [key: number]: boolean }>(
    {},
  );

  const handleMatchChange = (index: number, checked: boolean) => {
    setMatchStates((prev) => ({ ...prev, [index]: checked }));
  };

  const comparisonData = [
    {
      field: "IBAN",
      formValue: application?.iban || "-",
      extractedValue: bshResult?.extracted?.iban || "-",
      renderForm: () => <MaskedField value={application?.iban} type="iban" />,
      renderExtracted: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <MaskedField value={bshResult?.extracted?.iban} type="iban" />
          <ConfidenceBadge
            confidence={bshResult?.extracted?.ibanConfidence}
            isLowConfidence={bshResult?.extracted?.isIbanLowConfidence}
          />
        </Box>
      ),
    },
    {
      field: "Address",
      formValue: application?.address || "-",
      extractedValue: bshResult?.extracted?.customerAddress || "-",
      renderForm: () => (
        <MaskedField value={application?.address} type="address" />
      ),
      renderExtracted: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <MaskedField
            value={bshResult?.extracted?.customerAddress}
            type="address"
          />
          <ConfidenceBadge
            confidence={bshResult?.extracted?.customerAddressConfidence}
            isLowConfidence={
              bshResult?.extracted?.isCustomerAddressLowConfidence
            }
          />
        </Box>
      ),
    },
    {
      field: "Date",
      formValue: application?.createdAt
        ? new Date(application.createdAt).toLocaleDateString()
        : "-",
      extractedValue: bshResult?.extracted?.statementDate
        ? new Date(bshResult.extracted.statementDate).toLocaleDateString()
        : "-",
      renderExtracted: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <span>
            {bshResult?.extracted?.statementDate
              ? new Date(bshResult.extracted.statementDate).toLocaleDateString()
              : "-"}
          </span>
          <ConfidenceBadge
            confidence={bshResult?.extracted?.statementDateConfidence}
            isLowConfidence={bshResult?.extracted?.isStatementDateLowConfidence}
          />
        </Box>
      ),
    },
    {
      field: "LOP is Required",
      formValue: application?.jointTenancy,
      extractedValue: false,
    },
  ];

  useEffect(() => {
    if (matchStates[0] && matchStates[1] && matchStates[2]) {
      handleStatusChange({
        target: { value: "VALID" },
      } as SelectChangeEvent<string>);
    } else {
      handleStatusChange({
        target: { value: "INVALID" },
      } as SelectChangeEvent<string>);
    }
    if (lopRequirementChange && matchStates[3] !== undefined) {
      lopRequirementChange(matchStates[3]);
    }
  }, [matchStates, lopRequirementChange]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Comparison Table */}
      <TableContainer component={Paper}>
        <Table sx={{ mb: 0 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", width: "20%" }}></TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "35%" }}>
                Refund Value
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "35%" }}>
                BSH Value
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "10%",
                  textAlign: "center",
                }}
              >
                {/* Checkbox column */}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisonData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: "medium" }}>{row.field}</TableCell>
                <TableCell>
                  {row.renderForm ? row.renderForm() : row.formValue}
                </TableCell>
                <TableCell>
                  {row.renderExtracted
                    ? row.renderExtracted()
                    : row.extractedValue}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <MatchCheckbox
                    appValue={row.formValue}
                    bshValue={row.extractedValue}
                    index={index}
                    matchStates={matchStates}
                    onMatchChange={handleMatchChange}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Dropdown */}
      <FormControl fullWidth sx={{ mb: 2, display: "none" }}>
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={selectedStatus}
          label="Status"
          disabled={isLoading || bshResult === null}
          onChange={handleStatusChange}
        >
          <MenuItem value=""> &nbsp;</MenuItem>
          <MenuItem value="VALID">Valid</MenuItem>
          <MenuItem value="INVALID">Invalid</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
