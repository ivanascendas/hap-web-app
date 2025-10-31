import React from "react";
import {
  Box,
  Chip,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { RefundStatus } from "@shared/dtos/refund.dtos";
import { AdminFiltersState } from "@shared/redux/slices/adminRefundSlice";
import { getStatusLabel } from "../../utils/statusLabels";

/**
 * Props for RefundFilters component
 */
export interface RefundFiltersProps {
  /**
   * Current filter values
   */
  filters: AdminFiltersState;

  /**
   * Callback when filters change
   */
  onFilterChange: (filters: Partial<AdminFiltersState>) => void;

  /**
   * Available departments for filtering
   */
  departments?: Array<{ incDept: string; department?: string }>;
}

/**
 * RefundFilters component provides filtering controls for refund applications
 *
 * @component
 * @example
 * ```tsx
 * <RefundFilters
 *   filters={filters}
 *   onFilterChange={(newFilters) => dispatch(setAdminFilters(newFilters))}
 *   departments={departments}
 * />
 * ```
 */
export const RefundFilters: React.FC<RefundFiltersProps> = ({
  filters,
  onFilterChange,
  departments = [],
}) => {
  const allStatuses = [
    RefundStatus.Submitted,
    RefundStatus.PendingL1,
    RefundStatus.PendingL2,
    RefundStatus.PendingAP,
    RefundStatus.ReturnedForInfo,
    RefundStatus.Approved,
    RefundStatus.Rejected,
    RefundStatus.Cancelled,
    RefundStatus.Gl07Generated,
    RefundStatus.Exported,
    RefundStatus.Posted,
  ];

  return (
    <Box
      className="personal_box_filter"
      sx={{
        display: "flex",
        justifyContent: "space-between",
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
        <Select<RefundStatus[]>
          multiple
          value={filters.status ?? []}
          onChange={(e) => {
            const value = e.target.value as RefundStatus[];
            onFilterChange({
              status: value.length > 0 ? value : undefined,
            });
          }}
          displayEmpty
          sx={{ minWidth: "200px" }}
          size="small"
          renderValue={(selected) => {
            if (!selected || selected.length === 0) {
              return <em>All</em>;
            }
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value: RefundStatus) => (
                  <Chip
                    key={value}
                    label={getStatusLabel(value)}
                    size="small"
                    sx={{ height: "20px" }}
                  />
                ))}
              </Box>
            );
          }}
        >
          <MenuItem value="" disabled>
            <em>All</em>
          </MenuItem>
          {allStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {getStatusLabel(status)}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Department Filter */}
      {departments.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flex: "none",
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Department:
          </Typography>
          <Select
            value={filters.incDept ?? ""}
            onChange={(e) =>
              onFilterChange({
                incDept: e.target.value || undefined,
              })
            }
            displayEmpty
            sx={{ minWidth: "150px" }}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.incDept} value={dept.incDept}>
                {dept.incDept}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      <Box sx={{ flex: 1 }} />

      {/* Customer No / Search */}
      <Box
        className="personal_box_filter_search"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          Customer No:
        </Typography>
        <TextField
          value={filters.customerNo ?? ""}
          onChange={(e) =>
            onFilterChange({
              customerNo: e.target.value || undefined,
            })
          }
          placeholder="Search by customer number"
          size="small"
          sx={{ minWidth: "200px" }}
        />
      </Box>
    </Box>
  );
};
