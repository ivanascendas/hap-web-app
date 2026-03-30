import React, { useState } from "react";
import { MaskedField } from "@shared/components/MaskedField";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  CloudUpload,
  CloudDownload,
  CheckCircle,
} from "@mui/icons-material";
import {
  useGetBatchByIdQuery,
  useExportBatchMutation,
  usePostBatchMutation,
  useLazyDownloadBatchQuery,
} from "@shared/services/Gl07Batch.service";
import { Gl07BatchStatus, Gl07LineDto } from "@shared/dtos/gl07-batch.dtos";
import { TableComponent } from "@shared/components/Table.component";
import { Gl07BatchStatusBadge } from "../components/gl07-batches/Gl07BatchStatusBadge";
import { useDispatch } from "react-redux";
import { setNotify } from "@shared/redux/slices/notifySlice";
import "./gl07-batch-details.component.scss";

type ConfirmDialogType = "export" | "post" | null;

/**
 * Gl07BatchDetailsComponent - Detailed view of a GL07 batch
 *
 * Features:
 * - Display batch information
 * - Table with all GL07 lines
 * - Export batch to CSV (Generated -> Exported)
 * - Download CSV file (Exported/Posted)
 * - Mark as Posted (Exported -> Posted)
 */
export const Gl07BatchDetailsComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogType>(null);

  // Fetch batch details
  const {
    data: batch,
    isLoading,
    isError,
    refetch,
  } = useGetBatchByIdQuery(id!, {
    skip: !id,
  });

  // Mutations
  const [exportBatch, { isLoading: isExporting }] = useExportBatchMutation();
  const [postBatch, { isLoading: isPosting }] = usePostBatchMutation();
  const [downloadBatch] = useLazyDownloadBatchQuery();

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Handlers
  const handleBack = () => {
    navigate("/admin/gl07-batches");
  };

  const handleExportBatch = async () => {
    if (!id) return;

    try {
      await exportBatch(id).unwrap();
      dispatch(
        setNotify({
          message: "Batch exported successfully",
        }),
      );
      refetch();
    } catch {
      dispatch(
        setNotify({
          message: "Failed to export batch",
        }),
      );
    }
    setConfirmDialog(null);
  };

  const handlePostBatch = async () => {
    if (!id) return;

    try {
      await postBatch(id).unwrap();
      dispatch(
        setNotify({
          message: "Batch marked as posted successfully",
        }),
      );
      refetch();
    } catch {
      dispatch(
        setNotify({
          message: "Failed to mark batch as posted",
        }),
      );
    }
    setConfirmDialog(null);
  };

  const handleDownloadBatch = async () => {
    if (!id || !batch) return;

    try {
      const result = await downloadBatch({
        id,
        batchNumber: batch.batchNumber,
      });

      if ("data" in result && result.data) {
        const blob = new Blob([result.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${batch.batchNumber}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch {
      dispatch(
        setNotify({
          message: "Failed to download batch file",
        }),
      );
    }
  };

  // Table columns for GL07 lines
  const columns = [
    {
      key: "referenceCode" as const,
      label: "Reference",
      rowRender: (row: Gl07LineDto) => (
        <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
          {row.referenceCode}
        </Typography>
      ),
    },
    {
      key: "applicationId" as const,
      label: "Application ID",
      rowRender: (row: Gl07LineDto) => (
        <Typography
          variant="body2"
          fontFamily="monospace"
          sx={{
            color: "primary.main",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/refunds/${row.applicationId}`);
          }}
        >
          {row.applicationId.substring(0, 8)}...
        </Typography>
      ),
    },
    {
      key: "sundrySupplierId" as const,
      label: "Supplier ID",
    },
    {
      key: "name" as const,
      label: "Name",
    },
    {
      key: "trn" as const,
      label: "TRN/PPSN",
      rowRender: (row: Gl07LineDto) => (
        <MaskedField value={row.trn} type="ppsn" />
      ),
    },
    {
      key: "bankIban" as const,
      label: "IBAN",
      rowRender: (row: Gl07LineDto) => (
        <MaskedField value={row.bankIban} type="iban" />
      ),
    },
    {
      key: "bankBic" as const,
      label: "BIC",
      rowRender: (row: Gl07LineDto) => (
        <MaskedField value={row.bankBic} type="bic" />
      ),
    },
    {
      key: "amount" as const,
      label: "Amount",
      rowRender: (row: Gl07LineDto) => formatCurrency(row.amount),
    },
  ];

  if (isLoading) {
    return (
      <Box
        className="gl07-batch-details"
        sx={{ display: "flex", justifyContent: "center", p: 5 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !batch) {
    return (
      <Box className="gl07-batch-details" sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Batch not found
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Batches
        </Button>
      </Box>
    );
  }

  const canExport = batch.status === Gl07BatchStatus.Generated;
  const canDownload =
    batch.status === Gl07BatchStatus.Exported ||
    batch.status === Gl07BatchStatus.Posted;
  const canPost = batch.status === Gl07BatchStatus.Exported;

  return (
    <Box className="gl07-batch-details">
      {/* Header */}
      <Box sx={{ mb: 3, padding: "1.5rem" }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 1 }}>
          Back to Batches
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              {batch.batchNumber}
            </Typography>
            <Gl07BatchStatusBadge status={batch.status} size="medium" />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {canExport && (
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setConfirmDialog("export")}
                disabled={isExporting}
              >
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            )}
            {canDownload && (
              <Button
                variant="contained"
                startIcon={<CloudDownload />}
                onClick={handleDownloadBatch}
              >
                Download
              </Button>
            )}
            {canPost && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => setConfirmDialog("post")}
                disabled={isPosting}
              >
                {isPosting ? "Posting..." : "Mark as Posted"}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: "calc(100vh - 22rem)",
          overflow: "auto",
          padding: "0 1.5rem",
        }}
      >
        {/* Batch Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Batch Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Batch Number
                </Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {batch.batchNumber}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1">{batch.createdBy}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(batch.createdAt)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Gl07BatchStatusBadge status={batch.status} />
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Posted At
                </Typography>
                <Typography variant="body1">
                  {formatDate(batch.postedAt)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Lines
                </Typography>
                <Typography variant="body1">{batch.lines.length}</Typography>
              </Box>
            </Grid>
            {batch.filePath && (
              <Grid size={12}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    File Path
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {batch.filePath}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Batch Lines Table */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Batch Lines ({batch.lines.length})
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ overflowX: "auto" }}>
            <TableComponent
              columns={columns}
              rows={batch.lines}
              rowKey="gl07LineId"
              className="batch-lines-table"
            />
          </Box>
        </Paper>
      </Box>
      {/* Export Confirmation Dialog */}
      <Dialog
        open={confirmDialog === "export"}
        onClose={() => setConfirmDialog(null)}
      >
        <DialogTitle>Export Batch</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to export this batch to CSV? This will change
            the batch status to &quot;Exported&quot;.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
          <Button
            onClick={handleExportBatch}
            variant="contained"
            disabled={isExporting}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Post Confirmation Dialog */}
      <Dialog
        open={confirmDialog === "post"}
        onClose={() => setConfirmDialog(null)}
      >
        <DialogTitle>Mark as Posted</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm that this batch has been successfully posted to Agresso?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
          <Button
            onClick={handlePostBatch}
            variant="contained"
            color="success"
            disabled={isPosting}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
