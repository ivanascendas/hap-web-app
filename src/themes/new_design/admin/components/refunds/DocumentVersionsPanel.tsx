import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useDeleteDocumentVersionMutation,
  useGetDocumentVersionsQuery,
  useLazyGetDocumentBlobQuery,
} from "@shared/services/Refunds.service";
import { formatVersionDate } from "@shared/utils/versionDateFormatter";

export interface DocumentVersionsPanelProps {
  applicationId: string;
  documentId: string;
  currentLocale?: string;
}

export const DocumentVersionsPanel: React.FC<DocumentVersionsPanelProps> = ({
  applicationId,
  documentId,
  currentLocale = "en",
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = currentLocale || i18n.language;

  const { data, isLoading, error } = useGetDocumentVersionsQuery({
    applicationId,
    documentId,
  });
  const [deleteVersion] = useDeleteDocumentVersionMutation();
  const [downloadDocument] = useLazyGetDocumentBlobQuery();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const versions = useMemo(() => {
    const list = data ?? [];
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data]);

  const handleRedact = (versionId: string) => {
    navigate(
      `/admin/refunds/${applicationId}/documents/${documentId}/redact/${versionId}`,
    );
  };

  const handleDownload = async () => {
    try {
      await downloadDocument({ applicationId, documentId }).unwrap();
    } catch {
      // Keep silent here to avoid duplicate toasts with existing global notifications.
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setPendingDeleteId(confirmDeleteId);
    try {
      await deleteVersion({
        applicationId,
        documentId,
        versionId: confirmDeleteId,
      }).unwrap();
    } finally {
      setPendingDeleteId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 1, height: "100%", minHeight: 360 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("REFUNDS.VERSIONS.TITLE")}
      </Typography>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error != null && (
        <Alert severity="warning">{t("REFUNDS.VERSIONS.LOAD_ERROR")}</Alert>
      )}

      {!isLoading && error == null && versions.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("REFUNDS.VERSIONS.EMPTY")}
        </Typography>
      )}

      {!isLoading && error == null && versions.length > 0 && (
        <List sx={{ p: 0 }}>
          {versions.map((version, idx) => (
            <ListItem
              key={version.versionId}
              sx={{
                p: 1.5,
                mb: 1,
                display: "block",
                border: "1px solid #e6e6e6",
                borderRadius: 1,
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "primary.main" }}>
                {t("REFUNDS.VERSIONS.VERSION_LABEL", {
                  number: versions.length - idx,
                })}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {formatVersionDate(version.createdAt, locale)}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {t("REFUNDS.VERSIONS.CREATED_BY", { name: version.createdBy })}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {version.fileName}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleRedact(version.versionId)}
                >
                  {t("REFUNDS.VERSIONS.REDACT")}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  {t("REFUNDS.VERSIONS.DOWNLOAD")}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  disabled={pendingDeleteId === version.versionId}
                  onClick={() => setConfirmDeleteId(version.versionId)}
                >
                  {t("REFUNDS.VERSIONS.DELETE")}
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>{t("REFUNDS.VERSIONS.CONFIRM_DELETE_TITLE")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("REFUNDS.VERSIONS.CONFIRM_DELETE")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>
            {t("BUTTONS.CANCEL")}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            {t("REFUNDS.VERSIONS.DELETE")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
