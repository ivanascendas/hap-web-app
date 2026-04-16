import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Checkbox,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetApprovedApplicationsQuery,
  useCreateBatchMutation,
} from "@shared/services/Gl07Batch.service";
import { RefundApplicationListItemDto } from "@shared/dtos/gl07-batch.dtos";
import { TableComponent } from "@shared/components/Table.component";
import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "@shared/redux/slices/notifySlice";
import "./create-gl07-batch.component.scss";
import { selectUser } from "@shared/redux/slices/authSlice";

/**
 * CreateGl07BatchComponent - Page for creating a new GL07 batch
 *
 * Features:
 * - Table with approved applications
 * - Multi-select with checkboxes
 * - Display selected count and total amount
 * - Create batch button
 * - Navigation back to batches list
 */
export const CreateGl07BatchComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    Set<string>
  >(new Set());
  const user = useSelector(selectUser);
  // Fetch approved applications
  const { data, isFetching, isError } = useGetApprovedApplicationsQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  // Create batch mutation
  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();

  const applications = data?.items || [];
  const selectedApplications = applications.filter((app) =>
    selectedApplicationIds.has(app.applicationId),
  );

  // Calculate total amount
  const totalAmount = selectedApplications.reduce(
    (sum, app) => sum + app.amount,
    0,
  );
  const currency = selectedApplications[0]?.currency || "EUR";

  // Format currency
  const formatCurrency = (amount: number, curr: string): string => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: curr,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
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
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedApplicationIds(
        new Set(applications.map((app) => app.applicationId)),
      );
    } else {
      setSelectedApplicationIds(new Set());
    }
  };

  const handleSelectOne = (applicationId: string) => {
    const newSelected = new Set(selectedApplicationIds);
    if (newSelected.has(applicationId)) {
      newSelected.delete(applicationId);
    } else {
      newSelected.add(applicationId);
    }
    setSelectedApplicationIds(newSelected);
  };

  const handleCreateBatch = async () => {
    if (selectedApplicationIds.size === 0) {
      dispatch(
        setNotify({
          message: "Please select at least one application",
        }),
      );
      return;
    }

    try {
      const result = await createBatch({
        approvedApplicationIds: Array.from(selectedApplicationIds),
        createdBy: user?.customerNo || "admin",
      }).unwrap();

      dispatch(
        setNotify({
          message: `Batch ${result.batchNumber} created successfully with ${result.lineCount} applications`,
        }),
      );

      // Navigate to the new batch details
      navigate(`/admin/gl07-batches/${result.gl07BatchId}`);
    } catch {
      dispatch(
        setNotify({
          message: "Failed to create batch. Please try again.",
        }),
      );
    }
  };

  const handleCancel = () => {
    navigate("/admin/gl07-batches");
  };

  // Check if row is selected
  const isSelected = (applicationId: string) =>
    selectedApplicationIds.has(applicationId);

  // Table columns configuration
  const columns = [
    {
      key: "checkbox" as keyof RefundApplicationListItemDto,
      label: "",
      colRnder: () => (
        <Checkbox
          indeterminate={
            selectedApplicationIds.size > 0 &&
            selectedApplicationIds.size < applications.length
          }
          checked={
            applications.length > 0 &&
            selectedApplicationIds.size === applications.length
          }
          onChange={handleSelectAll}
        />
      ),
      rowRender: (row: RefundApplicationListItemDto) => (
        <Checkbox
          checked={isSelected(row.applicationId)}
          onChange={() => handleSelectOne(row.applicationId)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: "referenceCode" as keyof RefundApplicationListItemDto,
      label: "Reference",
      rowRender: (row: RefundApplicationListItemDto) => (
        <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
          {row.referenceCode}
        </Typography>
      ),
    },
    {
      key: "tenantId" as keyof RefundApplicationListItemDto,
      label: "Tenant ID",
    },
    {
      key: "applicantName" as keyof RefundApplicationListItemDto,
      label: "Applicant Name",
    },
    {
      key: "amount" as keyof RefundApplicationListItemDto,
      label: "Amount",
      rowRender: (row: RefundApplicationListItemDto) =>
        formatCurrency(row.amount, row.currency),
    },
    {
      key: "paymentMethod" as keyof RefundApplicationListItemDto,
      label: "Payment Method",
    },
    {
      key: "updatedAt" as keyof RefundApplicationListItemDto,
      label: "Approved At",
      rowRender: (row: RefundApplicationListItemDto) =>
        formatDate(row.updatedAt),
    },
  ];

  return (
    <Box className="create-gl07-batch-page">
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mb: 1 }}
          >
            Back to Batches
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            Create GL07 Batch
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select approved applications to include in the batch
          </Typography>
        </Box>
      </Box>

      {/* Selection Info */}
      {selectedApplicationIds.size > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={`${selectedApplicationIds.size} selected`}
              color="primary"
              size="small"
            />
            <Typography variant="body2">
              Total Amount:{" "}
              <strong>{formatCurrency(totalAmount, currency)}</strong>
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load approved applications. Please try again.
        </Alert>
      )}

      {/* Table */}
      <Paper
        sx={{
          mt: 2,
          height: "calc(100vh - 28rem)",
          overflow: "auto",
        }}
      >
        {isFetching && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!isFetching && !isError && applications.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No approved applications available for batch creation.
            </Typography>
          </Box>
        )}

        {!isFetching && !isError && applications.length > 0 && (
          <Box>
            <TableComponent
              columns={columns}
              rows={applications}
              rowKey="applicationId"
              className="create-batch-table"
              selected={(row) => isSelected(row.applicationId)}
            />
          </Box>
        )}
      </Paper>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 3,
        }}
      >
        <Button variant="outlined" onClick={handleCancel} disabled={isCreating}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleCreateBatch}
          disabled={selectedApplicationIds.size === 0 || isCreating}
        >
          {isCreating ? "Creating..." : "Create Batch"}
        </Button>
      </Box>
    </Box>
  );
};
