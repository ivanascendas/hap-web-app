import React from "react";
import { Chip, Tooltip } from "@mui/material";

export interface ConfidenceBadgeProps {
  /** Confidence score from 0.0 to 1.0 (null = no data) */
  confidence: number | null | undefined;
  /** If true, the field was flagged as low confidence by the backend */
  isLowConfidence?: boolean;
}

/**
 * Returns color config based on confidence thresholds:
 *  - >= 0.90 → green (high)
 *  - >= 0.70 → yellow/warning (medium)
 *  - < 0.70  → red (low)
 */
function getConfidenceLevel(confidence: number): {
  color: "success" | "warning" | "error";
  label: string;
} {
  if (confidence >= 0.9) {
    return { color: "success", label: "High" };
  }
  if (confidence >= 0.7) {
    return { color: "warning", label: "Medium" };
  }
  return { color: "error", label: "Low" };
}

/**
 * Displays a color-coded confidence badge with tooltip showing exact percentage.
 *
 * Usage:
 * ```tsx
 * <ConfidenceBadge confidence={0.95} />
 * <ConfidenceBadge confidence={0.65} isLowConfidence={true} />
 * ```
 */
export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  isLowConfidence,
}) => {
  if (confidence === null || confidence === undefined) {
    return null;
  }

  const pct = Math.round(confidence * 100);
  const { color, label } = getConfidenceLevel(confidence);

  // If backend flagged as low confidence, override to error
  const effectiveColor =
    isLowConfidence && color !== "error" ? "warning" : color;

  return (
    <Tooltip title={`OCR confidence: ${pct}% (${label})`} arrow>
      <Chip
        label={`${pct}%`}
        color={effectiveColor}
        size="small"
        variant="outlined"
        sx={{
          ml: 0.5,
          fontWeight: 600,
          fontSize: "0.7rem",
          height: 20,
          "& .MuiChip-label": { px: 0.75 },
        }}
      />
    </Tooltip>
  );
};

export default ConfidenceBadge;
