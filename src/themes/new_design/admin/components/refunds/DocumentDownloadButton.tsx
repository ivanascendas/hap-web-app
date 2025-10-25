import React from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useLazyDownloadDocumentQuery } from "@shared/services/Refunds.service";
import { toast } from "react-toastify";

export interface DocumentDownloadButtonProps {
  /**
   * Refund application ID
   */
  applicationId: string;

  /**
   * Document ID to download
   */
  documentId: string;

  /**
   * Optional document name for display
   */
  documentName?: string;

  /**
   * Button size
   */
  size?: "small" | "medium" | "large";

  /**
   * Button color
   */
  color?: "primary" | "secondary" | "default";
}

/**
 * IconButton component for downloading documents
 * Uses existing downloadDocument endpoint with automatic blob download
 */
export const DocumentDownloadButton: React.FC<DocumentDownloadButtonProps> = ({
  applicationId,
  documentId,
  documentName,
  size = "small",
  color = "primary",
}) => {
  const { t } = useTranslation();
  const [downloadDocument, { isLoading }] = useLazyDownloadDocumentQuery();

  const handleDownload = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      // The existing downloadDocument endpoint handles the download automatically
      e.preventDefault();
      e.stopPropagation();
      if (!applicationId || !documentId) {
        toast.error(t("REFUNDS.DOWNLOAD_ERROR"));
        return;
      }
      await downloadDocument({ applicationId, documentId });
      toast.success(t("REFUNDS.DOCUMENT_DOWNLOADED"));
    } catch (err) {
      const error = err as { data?: { detail?: string } };
      toast.error(error?.data?.detail || t("REFUNDS.DOWNLOAD_ERROR"));
    }
    return;
  };

  return (
    <Tooltip title={documentName || t("REFUNDS.DOWNLOAD_DOCUMENT")}>
      <span>
        <IconButton
          onClick={handleDownload}
          disabled={isLoading}
          color={color}
          size={size}
          aria-label={t("REFUNDS.DOWNLOAD_DOCUMENT")}
        >
          {isLoading ? <CircularProgress size={20} /> : <Download />}
        </IconButton>
      </span>
    </Tooltip>
  );
};
