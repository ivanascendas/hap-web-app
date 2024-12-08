import { Box, Button } from "@mui/material";
import { NotificationComponent } from "../../shared/components/Notification.component";
import { useParams } from "react-router-dom";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useTranslation } from "react-i18next";
import "./Invoices.component.scss";
import { RatesInvoicesComponent } from "./components/RatesInvoices.component";
import { RentsInvoiceComponent } from "./components/RentsInvoices.component";
import { LoansInvoiceComponent } from "./components/LoansInvoices.component";
import {
  useLazyDownloadRatesPdfQuery,
  useLazyGetBalanceQuery,
} from "../../shared/services/Statements.service";
import currency from "../../shared/utils/currency";
import React from "react";
import { InvoiceQueryParams } from "../../shared/dtos/invoice.dtos";

export const InvoicesComponent = (): JSX.Element => {
  const { department } = useParams();
  const { t } = useTranslation();
  const [dto, setDto] = React.useState<InvoiceQueryParams | null>(null);
  const [downloadPdf] = useLazyDownloadRatesPdfQuery();
  const [getBalance, { data: balance }] = useLazyGetBalanceQuery();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NotificationComponent />
      <Box sx={{ flexGrow: 1 }} className="invoices-container">
        <Box sx={{ flexGrow: 1 }} className="page_wrap_height">
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
            <RatesInvoicesComponent
              setInvoiceQueryParams={setDto}
              department={department || "rates"}
              getBalance={getBalance}
              balance={balance}
            />
            {/*department === 'rents' && <RentsInvoiceComponent department={department} getBalance={getBalance} balance={balance} />*/}
            {/*department === 'loans' && <LoansInvoiceComponent department={department} getBalance={getBalance} balance={balance} />*/}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
