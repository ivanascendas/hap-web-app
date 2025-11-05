import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  useLazyDownloadDocumentQuery,
  useLazyGetApplicationByIdQuery,
  useSubmitApplicationMutation,
} from "@shared/services/Refunds.service";
import { ApprovalAction, RefundStatus } from "@shared/dtos/refund.dtos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { UploadDocumentModal } from "./UploadDocumentModal";
import { ResubmitApplicationModal } from "./ResubmitApplicationModal";
import "./RefundDetails.component.scss";
import { selectUser } from "@shared/redux/slices/authSlice";
import { useSelector } from "react-redux";

export const RefundDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);

  const [submitApplication, { isLoading: isSubmitting }] =
    useSubmitApplicationMutation();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [getApplication, { data: application, isLoading, error }] =
    useLazyGetApplicationByIdQuery();
  //  const { data: documents } = useGetApplicationDocumentsQuery(id || '');
  const [downloadDocument] = useLazyDownloadDocumentQuery();
  const { documents } = application || { documents: [] };
  const getStatusColor = (
    status: RefundStatus,
  ): "default" | "primary" | "success" | "error" | "warning" => {
    switch (status) {
      case RefundStatus.Approved:
        return "success";
      case RefundStatus.Rejected:
        return "error";
      case RefundStatus.Submitted:
      case RefundStatus.ReturnedForInfo:
        return "warning";
      case RefundStatus.Posted:
        return "primary";
      default:
        return "default";
    }
  };

  const handleDownload = (documentId: string) => {
    if (id) {
      downloadDocument({ applicationId: id, documentId });
    }
  };

  const handleSubmit = async () => {
    if (application) {
      await submitApplication(application);
    }
  };

  useEffect(() => {
    if (user && id) {
      getApplication(id);
    }
  }, [user, id, getApplication]);

  if (isLoading) {
    return <Typography>{t("COMMON.LOADING")}</Typography>;
  }

  if (error || !application) {
    return <Typography color="error">{t("ERRORS.SERVER_ERROR")}</Typography>;
  }

  return (
    <Box
      className={`refund-details-container ${isMobile ? "refund-details-container--mobile" : ""}`}
      sx={{ margin: isMobile ? "0.5rem" : "1.5rem" }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/refunds")}
        sx={{ mb: 2 }}
        fullWidth={isMobile}
      >
        {t("REFUNDS.DETAILS.BACK_TO_LIST")}
      </Button>

      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        {t("REFUNDS.DETAILS.TITLE")} - {application.applicantName}
      </Typography>

      <Paper sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid size={12}>
            <Typography variant="subtitle2" color="textSecondary">
              {t("REFUNDS.DETAILS.STATUS")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                justifyContent: "start",
              }}
            >
              <Chip
                label={t(`REFUNDS.STATUS.${application.status}`)}
                color={getStatusColor(application.status)}
                sx={{ mt: 1 }}
              />
              {application.status === RefundStatus.ReturnedForInfo && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {
                    application.approvalSteps?.findLast(
                      (step) => step.action === ApprovalAction.RequestInfo,
                    )?.comment
                  }
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid size={isMobile ? 12 : 6}>
            <Typography variant="subtitle2" color="textSecondary">
              {t("REFUNDS.DETAILS.REQUESTED_AMOUNT")}
            </Typography>
            <Typography variant="h6">
              €{application.amount.toFixed(2)}
            </Typography>
          </Grid>
          <Grid size={isMobile ? 12 : 6}>
            <Typography variant="subtitle2" color="textSecondary">
              {t("REFUNDS.DETAILS.REASON")}
            </Typography>
            <Typography variant="body1">{application.refundReason}</Typography>
          </Grid>

          <Grid size={isMobile ? 12 : 6}>
            <Typography variant="subtitle2" color="textSecondary">
              {t("REFUNDS.DETAILS.EMAIL")}
            </Typography>
            <Typography variant="body1">{application.email}</Typography>
          </Grid>

          <Grid size={isMobile ? 12 : 6}>
            <Typography variant="subtitle2" color="textSecondary">
              {t("REFUNDS.DETAILS.PHONE")}
            </Typography>
            <Typography variant="body1">{application.phone}</Typography>
          </Grid>
          <Grid size={isMobile ? 12 : 6}>
            <Typography variant="subtitle2" color="textSecondary">
              {t("REFUNDS.DETAILS.PAYMENT_INFO")}
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
              (IBAN): {application.iban}{" "}
              {application.bic && ` / (BIC): ${application.bic}`}
              {application.jointTenancy &&
                ` (${t("REFUNDS.DETAILS.JOINT_TENANCY")})`}
            </Typography>
          </Grid>
          {application.createdAt && (
            <Grid size={isMobile ? 12 : 6}>
              <Typography variant="subtitle2" color="textSecondary">
                {t("REFUNDS.DETAILS.SUBMITTED_DATE")}
              </Typography>
              <Typography variant="body1">
                {new Date(application.createdAt).toLocaleString()}
              </Typography>
            </Grid>
          )}

          {application.bshVerified && (
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary">
                {t("REFUNDS.DETAILS.BSH_VERIFIED")}
              </Typography>
              <Chip
                label={t("REFUNDS.DETAILS.VERIFIED")}
                color="success"
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Documents Section */}
      <Paper sx={{ p: isMobile ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 1 : 0,
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("REFUNDS.DETAILS.DOCUMENTS")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => setUploadModalOpen(true)}
            fullWidth={isMobile}
          >
            {t("REFUNDS.UPLOAD.BUTTON")}
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {documents && documents.length > 0 ? (
          <List>
            {documents.map((doc) => (
              <ListItem
                key={doc.documentId}
                sx={{
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? 1 : 0,
                }}
                secondaryAction={
                  !isMobile && (
                    <Button
                      startIcon={<DownloadIcon />}
                      size="small"
                      onClick={() => handleDownload(doc.documentId)}
                    >
                      {t("REFUNDS.DETAILS.DOWNLOAD")}
                    </Button>
                  )
                }
              >
                <ListItemText
                  primary={doc.fileName}
                  secondary={`${t(`REFUNDS.DOCUMENT_TYPE.${doc.docType}`)} - ${doc.status}`}
                />
                {isMobile && (
                  <Button
                    startIcon={<DownloadIcon />}
                    size="small"
                    onClick={() => handleDownload(doc.documentId)}
                    fullWidth
                  >
                    {t("REFUNDS.DETAILS.DOWNLOAD")}
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">
            {t("REFUNDS.DETAILS.NO_DOCUMENTS")}
          </Typography>
        )}
      </Paper>

      {application.adminNotes && (
        <Paper
          sx={{
            p: isMobile ? 2 : 3,
            mt: isMobile ? 2 : 3,
            bgcolor: "info.light",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("REFUNDS.DETAILS.ADMIN_NOTES")}
          </Typography>
          <Typography variant="body1">{application.adminNotes}</Typography>
        </Paper>
      )}
      {application.status === RefundStatus.ReturnedForInfo && (
        <Paper
          sx={{
            p: isMobile ? 2 : 3,
            mt: isMobile ? 2 : 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                flex: "none",
                display: "flex",
                gap: 1,
                mt: 1,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate(`/refunds/${application.applicationId}/update`)
                }
                fullWidth={isMobile}
              >
                {t("BUTTONS.UPDATE")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit()}
                fullWidth={isMobile}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("BUTTONS.SENDING") : t("BUTTONS.SEND")}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
      {/* Upload Document Modal */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        applicationId={id || ""}
      />

      {/* Resubmit Application Modal */}
      <ResubmitApplicationModal
        open={resubmitModalOpen}
        onClose={() => setResubmitModalOpen(false)}
        application={application}
      />
    </Box>
  );
};
