import React, { useState } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { maskPii, type PiiType } from "@shared/utils/maskPii";

export interface MaskedFieldProps {
  /** The raw PII value to display */
  value: string | null | undefined;
  /** The type of PII — determines masking strategy */
  type: PiiType;
  /** If true, the field starts in the revealed state */
  defaultVisible?: boolean;
  /** MUI Typography variant for the value text */
  variant?: "body1" | "body2" | "caption" | "subtitle1" | "subtitle2";
  /** Additional sx styles for the container Box */
  sx?: object;
}

/**
 * Renders a PII value masked by default, with a toggle eye icon to reveal/hide.
 *
 * Usage:
 * ```tsx
 * <MaskedField value={application.iban} type="iban" />
 * ```
 */
export const MaskedField: React.FC<MaskedFieldProps> = ({
  value,
  type,
  defaultVisible = false,
  variant = "body2",
  sx,
}) => {
  const [visible, setVisible] = useState(defaultVisible);

  const displayValue = visible ? value || "-" : maskPii(value, type);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        ...sx,
      }}
    >
      <Typography
        variant={variant}
        component="span"
        sx={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
      >
        {displayValue}
      </Typography>
      <Tooltip title={visible ? "Hide" : "Show"}>
        <IconButton
          size="small"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide value" : "Show value"}
        >
          {visible ? (
            <VisibilityOffIcon fontSize="small" />
          ) : (
            <VisibilityIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default MaskedField;
