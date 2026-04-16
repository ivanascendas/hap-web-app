import React from "react";
import { Chip, Typography } from "@mui/material";
import {
  Gl07BatchStatus,
  Gl07BatchStatusLabels,
} from "@shared/dtos/gl07-batch.dtos";

/**
 * Props for Gl07BatchStatusBadge component
 */
export interface Gl07BatchStatusBadgeProps {
  /**
   * The GL07 batch status to display
   */
  status: Gl07BatchStatus;

  /**
   * Display variant: 'chip' or 'text'
   * @default 'chip'
   */
  variant?: "chip" | "text";

  /**
   * Size of the badge
   * @default 'small'
   */
  size?: "small" | "medium";
}

/**
 * Get color for GL07 batch status
 */
const getStatusColor = (status: Gl07BatchStatus): string => {
  switch (status) {
    case Gl07BatchStatus.Generated:
      return "#ff9800"; // warning/orange
    case Gl07BatchStatus.Exported:
      return "#2196f3"; // info/blue
    case Gl07BatchStatus.Posted:
      return "#4caf50"; // success/green
    default:
      return "#9e9e9e"; // grey
  }
};

/**
 * Gl07BatchStatusBadge component displays a colored badge for GL07 batch status
 *
 * @component
 * @example
 * ```tsx
 * <Gl07BatchStatusBadge status={Gl07BatchStatus.Generated} />
 * <Gl07BatchStatusBadge status={Gl07BatchStatus.Posted} variant="text" />
 * ```
 */
export const Gl07BatchStatusBadge: React.FC<Gl07BatchStatusBadgeProps> = ({
  status,
  variant = "chip",
  size = "small",
}) => {
  const label = Gl07BatchStatusLabels[status];
  const color = getStatusColor(status);

  if (variant === "text") {
    return (
      <Typography
        component="span"
        sx={{
          color,
          fontWeight: 600,
          fontSize: size === "small" ? "0.875rem" : "1rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
        {label}
      </Typography>
    );
  }

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: `${color}15`,
        color,
        fontWeight: 600,
        border: `1px solid ${color}40`,
        "& .MuiChip-label": {
          px: 1.5,
        },
      }}
    />
  );
};
