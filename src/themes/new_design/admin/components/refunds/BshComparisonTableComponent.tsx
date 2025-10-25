import React, { useState } from "react";
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

interface BshComparisonTableProps {
  selectedStatus: string;
  handleStatusChange: (event: SelectChangeEvent<string>) => void;
  application: RefundApplicationDto | null;
  bshResult: VerifyBshResponse | null;
  isLoading?: boolean;
}

export const BshComparisonTableComponent: React.FC<BshComparisonTableProps> = ({
  application,
  bshResult,
  selectedStatus,
  handleStatusChange,
  isLoading = false,
}) => {
  const [matchStates, setMatchStates] = useState<{ [key: number]: boolean }>(
    {},
  );

  const getMatchIcon = (
    appValue: string | null | undefined,
    bshValue: string | null | undefined,
    index: number,
  ): React.ReactNode => {
    const normalizedAppValue = appValue?.trim().toLowerCase() || "";
    const normalizedBshValue = bshValue?.trim().toLowerCase() || "";
    const isMatch =
      matchStates[index] ?? normalizedAppValue === normalizedBshValue;

    const handleCheckboxChange = (checked: boolean) => {
      setMatchStates((prev) => ({ ...prev, [index]: checked }));
    };

    return (
      <Checkbox
        checked={isMatch}
        onChange={(e) => handleCheckboxChange(e.target.checked)}
        disabled={true}
        sx={{
          color: isMatch ? "success.main" : "error.main",
          "&.Mui-checked": {
            color: isMatch ? "success.main" : "error.main",
          },
        }}
      />
    );
  };

  const comparisonData = [
    {
      field: "IBAN",
      formValue: application?.iban || "-",
      extractedValue: bshResult?.extracted?.iban || "-",
    },
    {
      field: "Address",
      formValue: application?.address || "-",
      extractedValue: bshResult?.extracted?.customerAddress || "-",
    },
    /*{
      field: 'Date',
      formValue: application?.createdAt
        ? new Date(application.createdAt).toLocaleDateString()
        : '-',
      extractedValue: bshResult?.extracted?.statementDate
        ? new Date(bshResult.extracted.statementDate).toLocaleDateString()
        : '-',
    },*/
  ];

  return (
    <Box sx={{ mt: 2 }}>
      {/* Comparison Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
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
                <TableCell>{row.formValue}</TableCell>
                <TableCell>{row.extractedValue}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {getMatchIcon(row.formValue, row.extractedValue, index)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
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
