import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetBatchesQuery } from "@shared/services/Gl07Batch.service";
import {
  Gl07BatchStatus,
  Gl07BatchListItemDto,
} from "@shared/dtos/gl07-batch.dtos";
import { TableComponent } from "@shared/components/Table.component";
import { TablePaginationActions } from "@shared/components/TablePaginationActions";
import { Gl07BatchStatusBadge } from "../components/gl07-batches/Gl07BatchStatusBadge";
import { Gl07BatchFilters } from "../components/gl07-batches/Gl07BatchFilters";
import "./gl07-batches.component.scss";
import { useUserRole } from "@shared/hooks/useUserRole";

/**
 * Gl07BatchesComponent - Admin page for managing GL07 batches
 *
 * Features:
 * - Filter by status
 * - Pagination with configurable page size
 * - Table view with sortable columns
 * - Navigation to detail page and create page
 * - Refresh functionality
 */
export const Gl07BatchesComponent: React.FC = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [statusFilter, setStatusFilter] = useState<Gl07BatchStatus | undefined>(
    undefined,
  );
  const { hasRole } = useUserRole();
  // Fetch batches
  const { data, isFetching, isError, refetch } = useGetBatchesQuery({
    pageNumber,
    pageSize,
    status: statusFilter,
  });

  const batches = data?.items || [];
  const totalCount = data?.count || 0;

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handlers
  const handleStatusFilterChange = (status?: Gl07BatchStatus) => {
    setStatusFilter(status);
    setPageNumber(1); // Reset to first page when filter changes
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage + 1); // MUI uses 0-based, API uses 1-based
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(parseInt(event.target.value));
    setPageNumber(1); // Reset to first page
  };

  const handleRowClick = (batch: Gl07BatchListItemDto) => {
    navigate(`/admin/gl07-batches/${batch.gl07BatchId}`);
  };

  const handleCreateBatch = () => {
    navigate("/admin/gl07-batches/create");
  };

  const handleRefresh = () => {
    refetch();
  };

  // Table columns configuration
  const columns = [
    {
      key: "batchNumber",
      label: "Batch Number",
      sortable: true,
      rowRender: (row: Gl07BatchListItemDto) => (
        <Typography
          variant="body2"
          fontFamily="monospace"
          sx={{ fontWeight: 600 }}
        >
          {row.batchNumber}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      rowRender: (row: Gl07BatchListItemDto) => (
        <Gl07BatchStatusBadge status={row.status} />
      ),
    },
    {
      key: "lineCount",
      label: "Applications",
      sortable: true,
      rowRender: (row: Gl07BatchListItemDto) => (
        <Typography variant="body2">{row.lineCount}</Typography>
      ),
    },
    {
      key: "createdBy",
      label: "Created By",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      rowRender: (row: Gl07BatchListItemDto) => formatDate(row.createdAt),
    },
    {
      key: "postedAt",
      label: "Posted At",
      sortable: true,
      rowRender: (row: Gl07BatchListItemDto) => formatDate(row.postedAt),
    },
  ];

  if (!hasRole("AP")) {
    return (
      <Box className="refund-details" sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="gl07-batches-page">
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            GL07 Batches
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage GL07 batches for Agresso integration
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isFetching}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateBatch}
          >
            Create New Batch
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load batches. Please try again.
        </Alert>
      )}

      {/* Filters */}
      <Gl07BatchFilters
        status={statusFilter}
        onStatusChange={handleStatusFilterChange}
      />

      {/* Table */}
      <Paper
        sx={{
          mt: 2,
          height: "calc(100vh - 22rem)",
          overflow: "auto",
        }}
      >
        {isFetching && batches.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="error">
              Failed to load batches. Please try again.
            </Typography>
          </Box>
        )}

        {!isFetching && !isError && batches.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No batches found matching your filters.
            </Typography>
          </Box>
        )}

        {!isFetching && !isError && batches.length > 0 && (
          <>
            <TableComponent
              columns={columns}
              rows={batches}
              onItemClick={handleRowClick}
              isLoading={isFetching}
              rowKey="gl07BatchId"
              className="admin-table"
            />

            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={totalCount}
              rowsPerPage={pageSize}
              page={pageNumber - 1} // MUI uses 0-based
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};
