import "./summary-box.component.scss";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import currency from "@shared/utils/currency";
import { useTranslation } from "react-i18next";

export interface SummaryBoxProps {
  variant?: "light" | "dark" | "short";
  value?: number;
  currentBalance?: number;
  onClick: () => void;
}

export const SummaryBoxComponent: React.FC<SummaryBoxProps> = ({
  variant = "dark",
  onClick,
  value,
  currentBalance,
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Box className={`summary-box-wrapper ${variant}`}>
      <Box
        className={`summary-box ${variant}  ${value && value > 0 ? "active" : ""}`}
      >
        <Box className="summary-box-content">
          <Typography component={"span"} className="header-balance-label">
            Total amount:
          </Typography>
          <Typography
            component={"span"}
            color="white"
            className="header-balance-text"
          >
            {" "}
            {currency.format(value || 0)}
          </Typography>
          {variant !== "short" && (
            <Box className="balance-holder">
              <Typography component={"span"} className="header-balance-label">
                Your Current Balance:
              </Typography>
              <Typography
                component={"span"}
                className={`header-balance-label balance ${currentBalance && currentBalance < 0 ? "negative" : ""}`}
              >
                {currentBalance
                  ? currency.format(currentBalance || 0)
                  : "Loading..."}
              </Typography>
            </Box>
          )}
        </Box>
        <Button
          fullWidth={variant === "light"}
          disabled={!(value && value > 0)}
          className="btn-primary"
          variant="contained"
          onClick={onClick}
        >
          {t(variant === "dark" ? "PAYMENT.PAY_NOW" : "BUTTONS.NEXT")}
        </Button>
      </Box>
    </Box>
  );
};
