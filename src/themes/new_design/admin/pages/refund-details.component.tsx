import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Info,
  Block,
  SwapHoriz,
} from "@mui/icons-material";
import { selectUser } from "@shared/redux/slices/authSlice";
import {
  useLazyGetApplicationByIdQuery,
  useLazyDownloadDocumentQuery,
  useAssignApplicationsMutation,
  useUnassignApplicationsMutation,
} from "@shared/services/Refunds.service";
import { RefundStatusBadge } from "../components/refunds/RefundStatusBadge";
import { DocumentsList } from "../components/refunds/DocumentsList";
import { ApprovalHistoryTimeline } from "../components/refunds/ApprovalHistoryTimeline";
import { ApproveModal } from "../components/refunds/modals/ApproveModal";
import { RejectModal } from "../components/refunds/modals/RejectModal";
import { RequestInfoModal } from "../components/refunds/modals/RequestInfoModal";
import { CancelModal } from "../components/refunds/modals/CancelModal";
import { formatCurrency, formatDate } from "../utils/statusLabels";
import { hasPermission, getUserApprovalLevel } from "../utils/rolePermissions";
import "./refund-details.component.scss";
import { useUserRole } from "@shared/hooks/useUserRole";
import { ReassignModal } from "../components/refunds/modals/ReassignModal";
import { RefundStatus } from "@shared/dtos/refund.dtos";

type ModalType =
  | "approve"
  | "reject"
  | "requestInfo"
  | "cancel"
  | "reassign"
  | null;

/**
 * RefundDetailsComponent - Detailed view of a refund application
 */
export const RefundDetailsComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [modalOpen, setModalOpen] = useState<ModalType>(null);

  const [assignApplication] = useAssignApplicationsMutation();
  const [unassignApplication] = useUnassignApplicationsMutation();

  // Fetch application details
  const [getDetails, { data: application, isLoading, isError }] =
    useLazyGetApplicationByIdQuery();
  const [downloadDoc] = useLazyDownloadDocumentQuery();
  const { hasRole } = useUserRole();

  useEffect(() => {
    if (user && id) {
      getDetails(id);
    }
  }, [user, id, getDetails]);

  if (!hasRole("DMU_L1") && !hasRole("DMU_L2") && !hasRole("AP")) {
    return (
      <Box className="refund-details" sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Access Denied
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        className="refund-details"
        sx={{ display: "flex", justifyContent: "center", p: 5 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !application) {
    return (
      <Box className="refund-details" sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Application not found
        </Typography>
        <Button onClick={() => navigate("/admin/refunds")} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  const level = getUserApprovalLevel(user, application.status);
  const canReassign = hasPermission("reassign", user, application);
  const canAssign = level
    ? hasPermission(
        `assignL${level}` as "assignL1" | "assignL2" | "assignL3",
        user,
        application,
      )
    : false;
  const canUnassign = level
    ? hasPermission("unassign", user, application)
    : false;
  const canApprove = level
    ? hasPermission(
        `approveL${level}` as "approveL1" | "approveL2" | "approveL3",
        user,
        application,
      )
    : false;
  const canReject = level
    ? hasPermission(
        `rejectL${level}` as "rejectL1" | "rejectL2" | "rejectL3",
        user,
        application,
      )
    : false;
  const canRequestInfo =
    level && level < 3
      ? hasPermission(
          `requestInfoL${level}` as "requestInfoL1" | "requestInfoL2",
          user,
          application,
        )
      : false;
  const canCancel = hasPermission("cancel", user, application);

  const handleDownload = (docId: string) => {
    downloadDoc({
      applicationId: application.applicationId,
      documentId: docId,
    });
  };

  return (
    <Box
      className="refund-details"
      sx={{ height: "calc(100vh - 15rem)", overflowY: "auto", pb: 10 }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin/refunds")}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ flex: 1 }}>
          Refund Application Details
        </Typography>
        <RefundStatusBadge
          assignName={
            application.status === RefundStatus.AssignedL1 ||
            application.status === RefundStatus.AssignedL2 ||
            application.status === RefundStatus.AssignedAP
              ? application.assignedToId
              : undefined
          }
          status={application.status}
          size="medium"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Application Summary */}
        <Grid size={12}>
          <Paper className="details-section">
            <Typography variant="h6" className="section-title">
              Application Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Application ID
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {application.referenceCode}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(application.amount, application.currency)}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {formatDate(application.createdAt)}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Updated
                </Typography>
                <Typography variant="body2">
                  {formatDate(application.updatedAt)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Applicant Info */}
        <Grid size={12}>
          <Paper className="details-section">
            <Typography variant="h6" className="section-title">
              Applicant Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body2">
                  {application.applicantName}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Customer No
                </Typography>
                <Typography variant="body2">{application.tenantId}</Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2">{application.email}</Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body2">
                  {application.phoneCode} {application.phone}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body2">{application.address}</Typography>
              </Grid>
              <Grid size={12} container spacing={2}>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">
                    IBAN
                  </Typography>
                  <Typography variant="body2">{application.iban}</Typography>
                </Grid>
                <Grid size={3}>
                  <Typography variant="caption" color="text.secondary">
                    BIC
                  </Typography>
                  <Typography variant="body2">{application.bic}</Typography>
                </Grid>
                <Grid size={3}>
                  <Typography variant="caption" color="text.secondary">
                    TRN/PPSN
                  </Typography>
                  <Typography variant="body2">{application.trnPpsn}</Typography>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">
                  Refund Reason
                </Typography>
                <Typography variant="body2">
                  {application.refundReason}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Documents */}
        <Grid
          size={6}
          sx={{
            display:
              application.documents && application.documents.length > 0
                ? "block"
                : "none",
          }}
        >
          <Paper className="details-section">
            <Typography variant="h6" className="section-title">
              Documents
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <DocumentsList
              documents={application.documents || []}
              applicationId={application.applicationId}
              onDownload={handleDownload}
              onDocumentClick={(documentId) =>
                navigate(
                  `/admin/refunds/${application.applicationId}/documents/${documentId}`,
                )
              }
            />
          </Paper>
        </Grid>

        {/* Approval History */}
        {application.approvalSteps && application.approvalSteps.length > 0 && (
          <Grid size={6}>
            <Paper className="details-section">
              <Typography variant="h6" className="section-title">
                Approval History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ApprovalHistoryTimeline steps={application.approvalSteps} />
            </Paper>
          </Grid>
        )}

        {/* Action Buttons */}
        {(canAssign ||
          canReassign ||
          canUnassign ||
          canApprove ||
          canReject ||
          canRequestInfo ||
          canCancel) && (
          <Grid size={12}>
            <Paper
              className="details-section"
              sx={{ backgroundColor: "#ffffff" }}
            >
              <Typography variant="h6" className="section-title">
                Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {canReassign && (
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<SwapHoriz />}
                    onClick={() => setModalOpen("reassign")}
                  >
                    Reassign
                  </Button>
                )}
                {canUnassign && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() =>
                      unassignApplication({
                        applicationId: application.applicationId,
                      })
                    }
                  >
                    Unassign (L{level})
                  </Button>
                )}
                {canAssign && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() =>
                      assignApplication({
                        applicationId: application.applicationId,
                      })
                    }
                  >
                    Assign (L{level})
                  </Button>
                )}
                {canApprove && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => setModalOpen("approve")}
                  >
                    Approve (L{level})
                  </Button>
                )}
                {canReject && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => setModalOpen("reject")}
                  >
                    Reject (L{level})
                  </Button>
                )}
                {canRequestInfo && (
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<Info />}
                    onClick={() => setModalOpen("requestInfo")}
                  >
                    Request Info (L{level})
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Block />}
                    onClick={() => setModalOpen("cancel")}
                  >
                    Cancel Application
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Modals */}
      {level && (
        <>
          <ApproveModal
            open={modalOpen === "approve"}
            applicationId={application.applicationId}
            level={level}
            onClose={() => setModalOpen(null)}
            onSuccess={() => navigate("/admin/refunds")}
          />
          <RejectModal
            open={modalOpen === "reject"}
            applicationId={application.applicationId}
            level={level}
            onClose={() => setModalOpen(null)}
            onSuccess={() => navigate("/admin/refunds")}
          />
          {level < 3 && (
            <RequestInfoModal
              open={modalOpen === "requestInfo"}
              applicationId={application.applicationId}
              level={level as 1 | 2}
              onClose={() => setModalOpen(null)}
              onSuccess={() => navigate("/admin/refunds")}
            />
          )}
        </>
      )}
      <ReassignModal
        open={modalOpen === "reassign"}
        applicationId={application.applicationId}
        onClose={() => setModalOpen(null)}
        onSuccess={() => navigate("/admin/refunds")}
      />
      <CancelModal
        open={modalOpen === "cancel"}
        applicationId={application.applicationId}
        onClose={() => setModalOpen(null)}
        onSuccess={() => navigate("/admin/refunds")}
      />
    </Box>
  );
};
