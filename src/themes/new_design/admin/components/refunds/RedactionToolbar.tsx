import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  Undo as UndoIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { RedactionRect } from "./RedactionCanvas";

export interface RedactionToolbarProps {
  rectangles: RedactionRect[];
  selectedRectId: string | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDeleteSelected: () => void;
  onUndoLast: () => void;
  onApply: (
    areas: { x: number; y: number; width: number; height: number }[],
  ) => Promise<void>;
  isApplying?: boolean;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

export const RedactionToolbar: React.FC<RedactionToolbarProps> = ({
  rectangles,
  selectedRectId,
  zoom,
  onZoomChange,
  onDeleteSelected,
  onUndoLast,
  onApply,
  isApplying = false,
}) => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const handleConfirmApply = async () => {
    setConfirmOpen(false);
    const areas = rectangles.map(({ x, y, width, height }) => ({
      x,
      y,
      width,
      height,
    }));

    await onApply(areas);
    setAdminNotes("");
  };

  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title={t("REFUNDS.REDACTION.ZOOM_OUT")}>
          <span>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoom - ZOOM_STEP))}
              disabled={zoom <= MIN_ZOOM}
            >
              <ZoomOutIcon fontSize="small" />
            </Button>
          </span>
        </Tooltip>

        <TextField
          size="small"
          value={`${Math.round(zoom * 100)}%`}
          disabled
          sx={{ width: 80, "& .MuiInputBase-input": { textAlign: "center" } }}
        />

        <Tooltip title={t("REFUNDS.REDACTION.ZOOM_IN")}>
          <span>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoom + ZOOM_STEP))}
              disabled={zoom >= MAX_ZOOM}
            >
              <ZoomInIcon fontSize="small" />
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Box sx={{ flex: 1 }} />

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={onDeleteSelected}
          disabled={!selectedRectId}
        >
          {t("REFUNDS.REDACTION.DELETE_SELECTED")}
        </Button>

        <Button
          size="small"
          variant="outlined"
          startIcon={<UndoIcon />}
          onClick={onUndoLast}
          disabled={rectangles.length === 0}
        >
          {t("REFUNDS.REDACTION.UNDO_LAST")}
        </Button>

        <Button
          size="small"
          variant="contained"
          startIcon={
            isApplying ? <CircularProgress size={16} /> : <CheckIcon />
          }
          onClick={() => setConfirmOpen(true)}
          disabled={rectangles.length === 0 || isApplying}
        >
          {isApplying
            ? t("REFUNDS.REDACTION.APPLYING")
            : t("REFUNDS.REDACTION.APPLY_BUTTON", { count: rectangles.length })}
        </Button>
      </Stack>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t("REFUNDS.REDACTION.CONFIRM_TITLE")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("REFUNDS.REDACTION.CONFIRM_MESSAGE", {
              count: rectangles.length,
            })}
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t("REFUNDS.REDACTION.ADMIN_NOTES")}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            {t("BUTTONS.CANCEL")}
          </Button>
          <Button
            onClick={handleConfirmApply}
            variant="contained"
            disabled={isApplying}
          >
            {t("REFUNDS.REDACTION.CONFIRM_BUTTON")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
