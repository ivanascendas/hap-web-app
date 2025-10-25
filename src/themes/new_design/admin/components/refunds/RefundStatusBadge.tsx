import React from "react";
import { Chip, Typography } from "@mui/material";
import { RefundStatus } from "@shared/dtos/refund.dtos";
import { getStatusLabel, getStatusColor } from "../../utils/statusLabels";

/**
 * Props for RefundStatusBadge component
 */
export interface RefundStatusBadgeProps {
  /**
   * The refund application status to display
   */
  status: RefundStatus;

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
 * RefundStatusBadge component displays a colored badge for refund application status
 *
 * @component
 * @example
 * ```tsx
 * <RefundStatusBadge status={RefundStatus.PendingL1} />
 * <RefundStatusBadge status={RefundStatus.Approved} variant="text" />
 * ```
 */
export const RefundStatusBadge: React.FC<RefundStatusBadgeProps> = ({
  status,
  variant = "chip",
  size = "small",
}) => {
  const label = getStatusLabel(status);
  const { color } = getStatusColor(status);

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
