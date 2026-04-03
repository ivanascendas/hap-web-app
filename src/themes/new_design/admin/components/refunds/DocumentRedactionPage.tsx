import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetApplicationByIdQuery,
  useLazyGetDocumentBlobQuery,
  useRedactDocumentMutation,
} from "@shared/services/Refunds.service";
import { showToast } from "@shared/utils/showToast";
import { NotificationComponent } from "@shared/components/Notification.component";
import { DocumentVersionsPanel } from "./DocumentVersionsPanel";
import { RedactionCanvas, RedactionRect } from "./RedactionCanvas";
import { RedactionToolbar } from "./RedactionToolbar";

export const DocumentRedactionPage: React.FC = () => {
  const { applicationId, documentId, versionId } = useParams<{
    applicationId: string;
    documentId: string;
    versionId?: string;
  }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const {
    data: application,
    isLoading,
    error,
  } = useGetApplicationByIdQuery(applicationId || "");
  const [getDocumentBlob] = useLazyGetDocumentBlobQuery();
  const [redactDocument, { isLoading: isSaving }] = useRedactDocumentMutation();

  const [rectangles, setRectangles] = useState<RedactionRect[]>([]);
  const [selectedRectId, setSelectedRectId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);

  const document = useMemo(
    () => application?.documents?.find((d) => d.documentId === documentId),
    [application, documentId],
  );

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!applicationId || !documentId || !document) return;

      setIsImageLoading(true);
      setImageLoadError(null);

      try {
        const blob = await getDocumentBlob({
          applicationId,
          documentId,
          format: "jpg",
          versionId,
        }).unwrap();
        const objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setImageUrl(objectUrl);
        } else {
          // Component unmounted before we could set the URL, so revoke it
          URL.revokeObjectURL(objectUrl);
        }
      } catch {
        if (isMounted) {
          setImageUrl(null);
          setImageLoadError(t("REFUNDS.REDACTION.LOAD_ERROR"));
        }
      } finally {
        if (isMounted) {
          setIsImageLoading(false);
        }
      }
    };

    void loadImage();

    return () => {
      isMounted = false;
      // Revoke URL on cleanup if it exists
      setImageUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
    };
  }, [applicationId, documentId, document, versionId, getDocumentBlob, t]);

  const handleApply = async (
    areas: { x: number; y: number; width: number; height: number }[],
  ) => {
    if (!applicationId || !documentId) return;

    try {
      await redactDocument({
        applicationId,
        documentId,
        body: { areas },
      }).unwrap();

      showToast("success", t("REFUNDS.REDACTION.SUCCESS"));
      navigate(`/admin/refunds/${applicationId}/documents/${documentId}`);
    } catch {
      showToast("error", t("REFUNDS.REDACTION.ERROR"));
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedRectId) return;
    setRectangles((prev) => prev.filter((r) => r.id !== selectedRectId));
    setSelectedRectId(null);
  };

  const handleUndoLast = () => {
    setRectangles((prev) => prev.slice(0, -1));
    setSelectedRectId(null);
  };

  if (!applicationId || !documentId) {
    return <Alert severity="error">{t("COMMON.ERROR_OCCURRED")}</Alert>;
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error || !document) {
    return <Alert severity="error">{t("REFUNDS.REDACTION.LOAD_ERROR")}</Alert>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <NotificationComponent />

      <Breadcrumbs sx={{ mb: 2 }}>
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate(`/admin/refunds/${applicationId}/documents/${documentId}`)
          }
          sx={{ textTransform: "none" }}
        >
          {t("REFUNDS.REDACTION.BACK_TO_DOCUMENT")}
        </Button>
        <Typography>{t("REFUNDS.REDACTION.TITLE")}</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ mb: 0.5 }}>
        {document.fileName}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("REFUNDS.REDACTION.DOCUMENT_ID", { id: documentId })}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "3fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              background: "#fff",
            }}
          >
            <RedactionToolbar
              rectangles={rectangles}
              selectedRectId={selectedRectId}
              zoom={zoom}
              onZoomChange={setZoom}
              onDeleteSelected={handleDeleteSelected}
              onUndoLast={handleUndoLast}
              onApply={handleApply}
              isApplying={isSaving}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              background: "#f7f7f7",
              minHeight: 450,
            }}
          >
            {(isSaving || isImageLoading) && <LinearProgress sx={{ mb: 2 }} />}
            {imageLoadError ? (
              <Alert severity="error">{imageLoadError}</Alert>
            ) : (
              <RedactionCanvas
                imageUrl={imageUrl || ""}
                rectangles={rectangles}
                onRectanglesChange={setRectangles}
                selectedRectId={selectedRectId}
                onSelectRect={setSelectedRectId}
                zoom={zoom}
              />
            )}
          </Box>
        </Box>

        <DocumentVersionsPanel
          applicationId={applicationId}
          documentId={documentId}
          currentLocale={i18n.language}
        />
      </Box>
    </Container>
  );
};
