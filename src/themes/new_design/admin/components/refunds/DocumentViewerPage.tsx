import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudIcon from "@mui/icons-material/Cloud";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import {
  useConfirmDocumentStatusMutation,
  useLazyDownloadDocumentQuery,
  useLazyGetApplicationByIdQuery,
  useLazyGetDocumentBlobQuery,
  useSubmitApplicationMutation,
  useVerifyBshMutation,
} from "@shared/services/Refunds.service";
import { selectUser } from "@shared/redux/slices/authSlice";
import { getDocumentTypeLabel } from "../../utils/statusLabels";
import { DocumentStatusConfirmationDialog } from "./DocumentStatusConfirmationDialog";
import { BshComparisonDialog } from "./BshComparisonDialog";
import { setError } from "@shared/redux/slices/errorSlice";
import { NotificationComponent } from "@shared/components/Notification.component";
import {
  RefundDocumentType,
  type VerifyBshResponse,
} from "@shared/dtos/refund.dtos";
import { BshComparisonComponent } from "./BshComparisonComponent";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const DocumentViewerPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applicationId, documentId } = useParams<{
    applicationId: string;
    documentId: string;
  }>();
  const dispatch = useDispatch();
  const [actionError, setActionError] = useState("");
  const [bshCertificateNumber] = useState("");
  const [bshVerificationResult, setBshVerificationResult] =
    useState<string>("Not Verified");
  const [bshComparisonDialogOpen, setBshComparisonDialogOpen] = useState(false);
  const [bshVerificationData, setBshVerificationData] =
    useState<VerifyBshResponse | null>(null);
  const [confirmStatusDialogOpen, setConfirmStatusDialogOpen] = useState(false);

  // PDF viewer state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const user = useSelector(selectUser);
  const isAdmin = user?.isAdmin || user?.isSuperAdmin;

  const [getApplication, { data: application, isLoading }] =
    useLazyGetApplicationByIdQuery();
  const [downloadDocument] = useLazyDownloadDocumentQuery();
  const [getDocumentBlob] = useLazyGetDocumentBlobQuery();
  const [verifyBsh, { isLoading: isVerifying }] = useVerifyBshMutation();
  const [submitApplication, { isLoading: isSubmitting }] =
    useSubmitApplicationMutation();
  const [confirmStatus] = useConfirmDocumentStatusMutation();
  // Find the current document
  const document = application?.documents?.find(
    (doc) => doc.documentId === documentId,
  );
  const [documentStatus, setDocumentStatus] = useState<
    "VALID" | "INVALID" | undefined
  >(document?.status || undefined);
  const handleBack = () => {
    navigate(`/admin/refunds/${applicationId}`);
    setBshVerificationData(null);
  };

  const handleLopRequirementChange = (isRequired: boolean) => {
    if (
      !isSubmitting &&
      application &&
      application.jointTenancy !== isRequired
    ) {
      const updatedApplication = {
        ...application,
        jointTenancy: isRequired,
      };
      submitApplication(updatedApplication)
        .unwrap()
        .then(() => {
          console.log("LOP Requirement updated successfully");
        })
        .catch((error) => {
          console.error("Error updating LOP Requirement:", error);
          const msg = t("ERRORS.SERVER_ERROR");
          dispatch(setError(new Error(msg)));
        });
    }
  };

  const loadDocument = async () => {
    if (!applicationId || !documentId) return;

    const result = await getDocumentBlob({
      applicationId,
      documentId,
    }).unwrap();

    // The result should be a Blob
    return result;
  };

  const loadPdfDocument = async () => {
    if (!applicationId || !documentId) return;

    setIsLoadingPdf(true);
    try {
      const result = await loadDocument();

      // The result should be a Blob
      if (result instanceof Blob) {
        const url = URL.createObjectURL(result);
        setPdfUrl(url);
      }
    } catch {
      dispatch(setError(new Error("Failed to load PDF document")));
      setActionError("Failed to load PDF document");
      setBshVerificationResult("Failed");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const loadImgDocument = async () => {
    if (!applicationId || !documentId) return;

    setIsLoadingPdf(true);
    try {
      const result = await loadDocument();

      // The result should be a Blob
      if (result instanceof Blob) {
        const url = URL.createObjectURL(result);
        setImgUrl(url);
      }
    } catch {
      dispatch(setError(new Error("Failed to load image document")));
      setActionError("Failed to load image document");
      setBshVerificationResult("Failed");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  useEffect(() => {
    if (user && applicationId) {
      getApplication(applicationId);
    }
  }, [user, applicationId, getApplication]);

  useEffect(() => {
    if (document && document.fileName.toLowerCase().endsWith(".pdf")) {
      loadPdfDocument();
    }
    if (
      document &&
      [".jpg", ".jpeg", ".png"].some((ext) =>
        document.fileName.toLowerCase().endsWith(ext),
      )
    ) {
      loadImgDocument();
    }
    setDocumentStatus(document?.status || undefined);
    // Cleanup URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [document?.documentId]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  const handleVerifyBsh = async () => {
    if (!applicationId) {
      dispatch(setError(new Error("Application ID is missing")));
      return;
    }

    try {
      console.log("Verifying BSH for document:", document);
      const result = await verifyBsh({
        applicationId,
        objectKey: document?.storagePath || bshCertificateNumber.trim(),
      }).unwrap();
      console.log("BSH verification result:", result);

      // Save the verification result and open comparison dialog
      setBshVerificationData(result);
      setBshVerificationResult(
        `Completed with status (${result.documentStatus})`,
      );
      // setBshComparisonDialogOpen(true);
    } catch (error) {
      console.error("Error verifying BSH:", error);
      const msg = t("ERRORS.SERVER_ERROR");
      dispatch(setError(new Error(msg)));
      setActionError(msg);
      setBshVerificationResult("Failed");
    }
  };

  const handleBshComparisonConfirm = async (selectedStatus: string) => {
    console.log("Confirming BSH status:", selectedStatus);
    if (!applicationId || !documentId || !bshVerificationData) return;

    try {
      await confirmStatus({
        applicationId,
        documentId: documentId,
        status: selectedStatus as "VALID" | "INVALID",
        comment: "BSH Verification",
      }).unwrap();

      setBshVerificationResult(
        selectedStatus === "VALID"
          ? "Certificate verified: Details extracted"
          : `✗ Certificate not verified: Invalid certificate`,
      );

      setBshComparisonDialogOpen(false);

      // Refresh application data
      await getApplication(applicationId);
    } catch (error) {
      console.error("Error confirming BSH status:", error);
      const msg = t("ERRORS.SERVER_ERROR");
      dispatch(setError(new Error(msg)));
    }
  };

  const handleBshComparisonOpenDocStatus = (status: string) => {
    setDocumentStatus(status as "VALID" | "INVALID");
    setConfirmStatusDialogOpen(true);
  };

  const handleBshComparisonCancel = () => {
    setBshComparisonDialogOpen(false);
    setBshVerificationData(null);
  };

  const handleDownload = () => {
    if (applicationId && documentId) {
      downloadDocument({ applicationId, documentId });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t("COMMON.LOADING")}</Typography>
      </Box>
    );
  }

  if (!document) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Document not found</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          {t("BUTTONS.BACK")}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <NotificationComponent />
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flex: 1 }}>
          Document Viewer
        </Typography>
        {isAdmin && (
          <Button
            variant="outlined"
            onClick={() =>
              navigate(
                `/admin/refunds/${applicationId}/documents/${documentId}/redact`,
              )
            }
          >
            {t("REFUNDS.DETAILS.REDACT_BUTTON")}
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={handleDownload}
          sx={{ mr: "2.4rem" }}
        >
          {t("REFUNDS.DETAILS.DOWNLOAD")}
        </Button>
      </Box>
      <Box sx={{ p: 3, height: "calc(100vh - 18rem)", overflowY: "auto" }}>
        {/* Document Info */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {document.fileName}
            </Typography>
            <Chip
              label={getDocumentTypeLabel(document.docType)}
              color="primary"
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Status: {document.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uploaded: {new Date(document.uploadedAt).toLocaleString()}
          </Typography>
        </Paper>
        <Grid container spacing={2}>
          <Grid
            size={document.docType === RefundDocumentType.BankHeader ? 6 : 12}
          >
            {/* Document Viewer */}
            <Paper
              sx={{
                p: 2,
                mb: 3,
                height: "calc(100vh - 22rem)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              {document.fileName.toLowerCase().endsWith(".pdf") ? (
                <>
                  {/* PDF Controls */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 2,
                      alignItems: "center",
                      height: "40px",
                      flex: "none",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={previousPage}
                      disabled={pageNumber <= 1}
                      startIcon={<NavigateBeforeIcon />}
                    >
                      Previous
                    </Button>
                    <Typography variant="body2">
                      Page {pageNumber} of {numPages || "?"}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={nextPage}
                      disabled={!numPages || pageNumber >= numPages}
                      endIcon={<NavigateNextIcon />}
                    >
                      Next
                    </Button>
                    <Box
                      sx={{
                        borderLeft: "1px solid #ccc",
                        height: "24px",
                        mx: 1,
                      }}
                    />
                    <IconButton
                      onClick={zoomOut}
                      disabled={scale <= 0.5}
                      size="small"
                    >
                      <ZoomOutIcon />
                    </IconButton>
                    <Typography variant="body2">
                      {Math.round(scale * 100)}%
                    </Typography>
                    <IconButton
                      onClick={zoomIn}
                      disabled={scale >= 3.0}
                      size="small"
                    >
                      <ZoomInIcon />
                    </IconButton>
                  </Box>

                  {/* PDF Document */}
                  <Box
                    sx={{
                      maxHeight: "600px",
                      overflowY: "auto",
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {isLoadingPdf ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "400px",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : pdfUrl ? (
                      <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: "400px",
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        }
                        error={
                          <Box sx={{ textAlign: "center", p: 3 }}>
                            <Typography color="error">
                              Failed to load PDF document
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={handleDownload}
                              sx={{ mt: 2 }}
                            >
                              Download to View
                            </Button>
                          </Box>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          scale={scale}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                      </Document>
                    ) : (
                      <Box sx={{ textAlign: "center", p: 3 }}>
                        <Typography color="text.secondary">
                          No PDF available for preview
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={handleDownload}
                          sx={{ mt: 2 }}
                        >
                          Download to View
                        </Button>
                      </Box>
                    )}
                  </Box>
                </>
              ) : [".jpg", ".jpeg", ".png"].some((ext) =>
                  document.fileName.toLowerCase().endsWith(ext),
                ) ? (
                <>
                  {/* Image Preview */}
                  <Box
                    sx={{
                      maxHeight: "600px",
                      overflowY: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      cursor: imgUrl ? "pointer" : "default",
                    }}
                    onClick={() => imgUrl && setLightboxOpen(true)}
                  >
                    {isLoadingPdf ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "400px",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : imgUrl ? (
                      <Box sx={{ textAlign: "center" }}>
                        <img
                          src={imgUrl}
                          alt={document.fileName}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "500px",
                            height: "auto",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 2, display: "block" }}
                        >
                          Click image to view in full screen with zoom
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center", p: 3 }}>
                        <Typography color="text.secondary">
                          No image available for preview
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={handleDownload}
                          sx={{ mt: 2 }}
                        >
                          Download to View
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Lightbox for full-screen viewing with zoom */}
                  <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={[{ src: imgUrl || "" }]}
                    plugins={[Zoom]}
                    zoom={{
                      maxZoomPixelRatio: 3,
                      scrollToZoom: true,
                    }}
                  />
                </>
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    Document Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {document.fileName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2, display: "block" }}
                  >
                    Preview is only available for PDF documents
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    sx={{ mt: 2 }}
                  >
                    Download to View
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          {document.docType === RefundDocumentType.BankHeader && (
            <Grid size={6}>
              <BshComparisonComponent
                title={bshVerificationResult}
                application={application || null}
                bshResult={bshVerificationData}
                onClose={handleBshComparisonCancel}
                onConfirm={handleBshComparisonOpenDocStatus}
                handleLopRequirementChange={handleLopRequirementChange}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        {document.docType !== RefundDocumentType.BankHeader && isAdmin && (
          <>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleBshComparisonOpenDocStatus("INVALID")}
              size="large"
            >
              {t("BUTTONS.REJECT")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleBshComparisonOpenDocStatus("VALID")}
              size="large"
            >
              {t("BUTTONS.APPROVE")}
            </Button>
          </>
        )}
        {document.docType === RefundDocumentType.BankHeader && (
          <Button
            variant="outlined"
            startIcon={<CloudIcon />}
            onClick={handleVerifyBsh}
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify BSH"}
          </Button>
        )}
      </Box>

      {actionError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {actionError}
        </Alert>
      )}

      {/* Document Status Confirmation Dialog */}
      {documentId && applicationId && (
        <DocumentStatusConfirmationDialog
          open={confirmStatusDialogOpen}
          onClose={() => setConfirmStatusDialogOpen(false)}
          applicationId={applicationId}
          documentId={documentId}
          currentStatus={documentStatus}
        />
      )}

      {/* BSH Comparison Dialog */}
      <BshComparisonDialog
        open={bshComparisonDialogOpen}
        onClose={handleBshComparisonCancel}
        onConfirm={handleBshComparisonConfirm}
        application={application || null}
        bshResult={bshVerificationData}
        isLoading={isVerifying}
      />
    </Box>
  );
};
