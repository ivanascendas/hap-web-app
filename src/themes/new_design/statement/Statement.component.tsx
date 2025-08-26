import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { useParams } from "react-router-dom";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useTranslation } from "react-i18next";
import "./Statement.component.scss";
import { RatesStatementComponent } from "./components/RatesStatement.component";
import { RentsStatementComponent } from "./components/RentsStatement.component";
import { LoansStatementComponent } from "./components/LoansStatement.component";
import { LoanInfoStatementComponent } from "./components/LoanInfoStatement.component";
import { DocumentsStatementComponent } from "./components/DocumentsStatement.component";
import {
  useLazyDownloadRatesPdfQuery,
  useLazyGetBalanceQuery,
} from "@shared/services/Statements.service";
import currency from "@shared/utils/currency";

import DownloadForOfflineIcon from "@mui/icons-material/Download";

import { StatementQueryParams } from "@shared/dtos/statement.dtos";
import React, { useState } from "react";
import { HeaderStatementComponent } from "./components/Header.component";

export const StatementComponent = (): JSX.Element => {
  const { department } = useParams();
  const { t } = useTranslation();
  const [dto, setDto] = React.useState<StatementQueryParams | null>(null);
  const [downloadPdf] = useLazyDownloadRatesPdfQuery();
  const [getBalance, { data: balance }] = useLazyGetBalanceQuery();
  const [includePreviousYear, setIncludePreviousYear] = useState(false);

  const handlePrintPdf = async () => {
    if (dto) {
      const result = await downloadPdf(dto);
      if (result.data) {
        const blobUrl = URL.createObjectURL(result.data);

        // Check if we're on mobile
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          );

        if (isMobile) {
          // On mobile, open PDF in new window/tab for user to handle printing
          const link = document.createElement("a");
          link.href = blobUrl;
          link.target = "_blank";
          link.download = "statement.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Cleanup
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        } else {
          // Desktop behavior - use iframe for direct printing
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = blobUrl;

          iframe.onload = () => {
            iframe.contentWindow?.print();
            // Cleanup after print dialog closes
            //setTimeout(() => {
            // URL.revokeObjectURL(blobUrl);
            // document.body.removeChild(iframe);
            // }, 1000);
          };

          document.body.appendChild(iframe);
        }
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow: 1 }} className="statement-container">
        <Box sx={{ flexGrow: 1 }} className="page_wrap_height">
          <HeaderStatementComponent getBalance={getBalance} balance={balance} />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              paddingTop: 0,
              flexDirection: { xs: "column", md: "row" },
              marginBottom: { xs: "1rem", md: "0" },
              marginLeft: { xs: "0.625rem", md: "0" },
            }}
            className="page_wrap_height_title"
          >
            <h1 className="h_title">
              <p className="title-dept">
                {department
                  ? t(
                      `MAIN.MENU.${department?.toUpperCase().replace("-", "_")}`,
                    )
                  : ""}
              </p>
              {department?.toLocaleLowerCase() !== "documents" && (
                <span>&nbsp;{t("MAIN.STATEMENT")}</span>
              )}
            </h1>
            <Box
              sx={{
                flexGrow: 1,
                display: { md: "flex", gap: "0.8rem" },
              }}
              className="h_title_right"
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includePreviousYear}
                      onChange={(e) => setIncludePreviousYear(e.target.checked)}
                    />
                  }
                  label={t(
                    "RATES.FILTER.DATE_RANGE_OPTIONS.INCLUDE_PREVIOUS_YEAR",
                  )}
                />
              </Box>
              {department?.toLocaleLowerCase() !== "documents" && (
                <Button
                  className="print_btn primary-button"
                  onClick={handlePrintPdf}
                >
                  <LocalPrintshopIcon />
                  <span className="print_text">
                    &nbsp;{t("MAIN.PRINT_STATEMENT")}
                  </span>
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} className="page_wrap_height_content">
            {department === "rates" && (
              <RatesStatementComponent
                includePreviousYear={includePreviousYear}
                setStatementQueryParams={setDto}
                department={department}
                getBalance={getBalance}
              />
            )}
            {department === "rents" && (
              <RentsStatementComponent
                department={department}
                getBalance={getBalance}
                balance={balance}
              />
            )}
            {department === "loans" && (
              <LoansStatementComponent
                department={department}
                getBalance={getBalance}
                balance={balance}
              />
            )}
            {department === "loan-info" && (
              <LoanInfoStatementComponent department={department} />
            )}
            {department === "documents" && (
              <DocumentsStatementComponent department={department} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
