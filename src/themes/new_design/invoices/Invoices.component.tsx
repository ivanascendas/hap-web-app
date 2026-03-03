import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Invoices.component.scss";

import WestIcon from "@mui/icons-material/West";
import {
  useLazyDownloadRatesPdfQuery,
  useLazyGetBalanceQuery,
} from "@shared/services/Statements.service";
import React from "react";
import { InvoiceQueryParams } from "@shared/dtos/invoice.dtos";
import { MonthlyInvoiceComponent } from "./components/MonthlyInvoice.component";
import { RatesInvoicesComponent } from "./components/RatesInvoices.component";

export const InvoicesComponent = (): JSX.Element => {
  const { department } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dto, setDto] = React.useState<InvoiceQueryParams | null>(null);
  const [downloadPdf] = useLazyDownloadRatesPdfQuery();
  const [getBalance, { data: balance }] = useLazyGetBalanceQuery();
  const [showMonthly] = React.useState<boolean>(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow: 1 }} className="invoices-container">
        <Box
          sx={{ flexGrow: 1 }}
          className={showMonthly ? "" : "page_wrap_height"}
        >
          <Button
            onClick={() => navigate("/statements")}
            startIcon={<WestIcon />}
            sx={{
              marginLeft: "2.56rem",
              display: { xs: "none", lg: "flex" },
            }}
          >
            {t("BUTTONS.BACK_TO_STATEMENTS")}
          </Button>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              paddingTop: 0,
            }}
            className="page_wrap_height_title"
          >
            <h1 className="h_title">
              <span>&nbsp;{t("INVOICES.RATES.TITLE")}</span>
            </h1>
          </Box>

          <Box sx={{ flexGrow: 1 }} className="page_wrap_height_content">
            {showMonthly ? (
              <MonthlyInvoiceComponent
                setInvoiceQueryParams={setDto}
                department={department || "rates"}
                getBalance={getBalance}
                balance={balance}
              />
            ) : (
              <RatesInvoicesComponent
                setInvoiceQueryParams={setDto}
                department={department || "rates"}
                getBalance={getBalance}
                balance={balance}
              />
            )}
            {/*department === 'rents' && <RentsInvoiceComponent department={department} getBalance={getBalance} balance={balance} />*/}
            {/*department === 'loans' && <LoansInvoiceComponent department={department} getBalance={getBalance} balance={balance} />*/}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
