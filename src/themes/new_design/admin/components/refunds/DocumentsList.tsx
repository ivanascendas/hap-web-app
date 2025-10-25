import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import {
  Description,
  AccountBalance,
  Badge,
  Receipt,
  HelpOutline,
  CheckCircle,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  RefundDocumentDto,
  RefundDocumentType,
} from "@shared/dtos/refund.dtos";
import { selectUser } from "@shared/redux/slices/authSlice";
import { getDocumentTypeLabel, formatDate } from "../../utils/statusLabels";
import { DocumentDownloadButton } from "./DocumentDownloadButton";
import { DocumentStatusConfirmationDialog } from "./DocumentStatusConfirmationDialog";

/**
 * Props for DocumentsList component
 */
export interface DocumentsListProps {
  /**
   * Array of documents to display
   */
  documents: RefundDocumentDto[];

  /**
   * Application ID for download context
   */
  applicationId: string;

  /**
   * Callback when download button is clicked
   */
  onDownload: (documentId: string) => void;

  /**
   * Callback when document is clicked
   */
  onDocumentClick?: (documentId: string) => void;

  /**
   * Whether to show admin actions (confirm status)
   */
  showAdminActions?: boolean;
}

/**
 * Gets the appropriate icon for a document type
 */
const getDocumentIcon = (docType: RefundDocumentType): React.ReactElement => {
  switch (docType) {
    case RefundDocumentType.BankHeader:
      return <AccountBalance color="primary" />;
    case RefundDocumentType.PermissionLetter:
      return <Description color="info" />;
    case RefundDocumentType.Identity:
      return <Badge color="success" />;
    case RefundDocumentType.Cheque:
      return <Receipt color="warning" />;
    case RefundDocumentType.ThirdParty:
    case RefundDocumentType.Query:
      return <HelpOutline color="action" />;
    default:
      return <Description />;
  }
};

/**
 * DocumentsList component displays a list of documents with download functionality
 *
 * @component
 * @example
 * ```tsx
 * <DocumentsList
 *   documents={application.documents}
 *   applicationId={application.applicationId}
 *   onDownload={(docId) => downloadDoc({ applicationId, documentId: docId })}
 *   showAdminActions={isAdmin}
 * />
 * ```
 */
export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  applicationId,
  onDocumentClick,
  showAdminActions = false,
}) => {
  const user = useSelector(selectUser);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<RefundDocumentDto | null>(null);

  // Check if user has admin role
  const isAdmin = showAdminActions && (user?.isAdmin || user?.isSuperAdmin);

  const handleConfirmStatus = (doc: RefundDocumentDto, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocument(doc);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedDocument(null);
  };

  if (!documents || documents.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No documents available
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <List sx={{ width: "100%" }}>
        {documents.map((doc) => (
          <ListItem
            key={doc.documentId}
            onClick={() => onDocumentClick?.(doc.documentId)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              mb: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {isAdmin && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    onClick={(e) => handleConfirmStatus(doc, e)}
                    sx={{ mr: 1 }}
                  >
                    Confirm Status
                  </Button>
                )}
                <DocumentDownloadButton
                  applicationId={applicationId}
                  documentId={doc.documentId}
                  documentName={doc.fileName}
                />
              </Box>
            }
          >
            <ListItemIcon>{getDocumentIcon(doc.docType)}</ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                    }}
                  >
                    {doc.fileName}
                  </Typography>
                  <Chip
                    label={getDocumentTypeLabel(doc.docType)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Uploaded: {formatDate(doc.uploadedAt)}
                  </Typography>
                  {doc.status && (
                    <Chip
                      label={doc.status}
                      size="small"
                      color={
                        doc.status === "VALID"
                          ? "success"
                          : doc.status === "INVALID"
                            ? "error"
                            : "default"
                      }
                      variant="filled"
                    />
                  )}
                </Box>
              }
              secondaryTypographyProps={{ component: "div" }}
            />
          </ListItem>
        ))}
      </List>

      {selectedDocument && (
        <DocumentStatusConfirmationDialog
          open={confirmDialogOpen}
          onClose={handleCloseConfirmDialog}
          applicationId={applicationId}
          documentId={selectedDocument.documentId}
          currentStatus={selectedDocument.status}
        />
      )}
    </>
  );
};
