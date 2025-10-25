import React from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import {
  Gl07BatchStatus,
  Gl07BatchStatusLabels,
} from "@shared/dtos/gl07-batch.dtos";

/**
 * Props for Gl07BatchFilters component
 */
export interface Gl07BatchFiltersProps {
  /**
   * Current status filter value
   */
  status?: Gl07BatchStatus;

  /**
   * Callback when status filter changes
   */
  onStatusChange: (status?: Gl07BatchStatus) => void;
}

/**
 * Gl07BatchFilters component provides filtering controls for GL07 batches
 *
 * @component
 * @example
 * ```tsx
 * <Gl07BatchFilters
 *   status={filters.status}
 *   onStatusChange={(status) => setFilters({ ...filters, status })}
 * />
 * ```
 */
export const Gl07BatchFilters: React.FC<Gl07BatchFiltersProps> = ({
  status,
  onStatusChange,
}) => {
  const allStatuses = [
    Gl07BatchStatus.Generated,
    Gl07BatchStatus.Exported,
    Gl07BatchStatus.Posted,
  ];

  return (
    <Box
      className="personal_box_filter"
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1rem 0",
        flexWrap: "wrap",
      }}
    >
      {/* Status Filter */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flex: "none",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          Status:
        </Typography>
        <Select
          value={status !== undefined ? status.toString() : ""}
          onChange={(e) =>
            onStatusChange(
              e.target.value
                ? (Number(e.target.value) as Gl07BatchStatus)
                : undefined,
            )
          }
          displayEmpty
          sx={{ minWidth: "200px" }}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          {allStatuses.map((statusValue) => (
            <MenuItem key={statusValue} value={statusValue.toString()}>
              {Gl07BatchStatusLabels[statusValue]}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};
