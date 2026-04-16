import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { RefundDocumentType } from "@shared/dtos/refund.dtos";
import { useUploadDocumentMutation } from "@shared/services/Refunds.service";
import { validateFile, ALLOWED_EXTENSIONS } from "@shared/utils/fileValidation";

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onClose,
  applicationId,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<RefundDocumentType>(
    RefundDocumentType.BankHeader,
  );
  const [error, setError] = useState<string>("");

  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(t(validationError.i18nKey));
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("REFUNDS.UPLOAD.NO_FILE_SELECTED"));
      return;
    }

    try {
      await uploadDocument({
        applicationId,
        documentType,
        file: selectedFile,
      }).unwrap();

      // Reset state and close modal
      setSelectedFile(null);
      setDocumentType(RefundDocumentType.BankHeader);
      setError("");
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      const errorMessage =
        (err as { data?: { detail?: string } })?.data?.detail ||
        t("ERRORS.UPLOAD_FAILED");
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>{t("REFUNDS.UPLOAD.TITLE")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="document-type-label">
              {t("REFUNDS.UPLOAD.DOCUMENT_TYPE")}
            </InputLabel>
            <Select
              labelId="document-type-label"
              value={documentType}
              label={t("REFUNDS.UPLOAD.DOCUMENT_TYPE")}
              onChange={(e) =>
                setDocumentType(e.target.value as RefundDocumentType)
              }
            >
              <MenuItem value={RefundDocumentType.BankHeader}>
                {t("REFUNDS.DOCUMENT_TYPE.0")}
              </MenuItem>
              <MenuItem value={RefundDocumentType.PermissionLetter}>
                {t("REFUNDS.DOCUMENT_TYPE.1")}
              </MenuItem>
              <MenuItem value={RefundDocumentType.Identity}>
                {t("REFUNDS.DOCUMENT_TYPE.2")}
              </MenuItem>
              <MenuItem value={RefundDocumentType.ThirdParty}>
                {t("REFUNDS.DOCUMENT_TYPE.3")}
              </MenuItem>
              <MenuItem value={RefundDocumentType.Cheque}>
                {t("REFUNDS.DOCUMENT_TYPE.4")}
              </MenuItem>
              <MenuItem value={RefundDocumentType.Query}>
                {t("REFUNDS.DOCUMENT_TYPE.5")}
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Box
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "80%",
                  flex: 1,
                }}
              >
                {selectedFile
                  ? selectedFile.name
                  : t("REFUNDS.UPLOAD.SELECT_FILE")}
              </Box>
              <input
                type="file"
                hidden
                accept={ALLOWED_EXTENSIONS}
                style={{ flex: 1, padding: 1, height: "auto" }}
                onChange={handleFileChange}
              />
            </Box>
          </Button>

          <Typography variant="caption" color="textSecondary" display="block">
            {t("REFUNDS.UPLOAD.FILE_REQUIREMENTS")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {isLoading && <LinearProgress sx={{ mt: 2 }} />}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: isMobile ? "column-reverse" : "row",
          gap: isMobile ? 1 : 0,
          px: isMobile ? 2 : 3,
          pb: isMobile ? 2 : 1,
        }}
      >
        <Button onClick={handleClose} disabled={isLoading} fullWidth={isMobile}>
          {t("BUTTONS.CANCEL")}
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!selectedFile || isLoading}
          fullWidth={isMobile}
        >
          {t("REFUNDS.UPLOAD.UPLOAD_BUTTON")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
