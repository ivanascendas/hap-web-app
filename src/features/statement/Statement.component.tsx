import { Box, Button } from "@mui/material";
import { NotificationComponent } from "../../shared/components/Notification.component";
import { useParams } from "react-router-dom";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useTranslation } from "react-i18next";
import './Statement.component.scss';
import { RatesStatementComponent } from "./components/RatesStatement.component";
import { RentsStatementComponent } from "./components/RentsStatement.component";
import { LoansStatementComponent } from "./components/LoansStatement.component";
import { LoanInfoStatementComponent } from "./components/LoanInfoStatement.component";
import { DocumentsStatementComponent } from "./components/DocumentsStatement.component";
import { useLazyDownloadRatesPdfQuery, useLazyGetBalanceQuery } from "../../shared/services/Statements.service";
import currency from "../../shared/utils/currency";
import moment from "moment";
import { StatementQueryParams } from "../../shared/dtos/statement.dtos";
import React from "react";

export const StatementComponent = (): JSX.Element => {
  const { department } = useParams();
  const { t } = useTranslation();
  const [dto, setDto] = React.useState<StatementQueryParams | null>(null);
  const [downloadPdf] = useLazyDownloadRatesPdfQuery();
  const [getBalance, { data: balance }] = useLazyGetBalanceQuery();

  const handlePrintPdf = async () => {
    if (dto) {
      const result = await downloadPdf(dto);
      if (result.data) {
        const blobUrl = URL.createObjectURL(result.data);
        const iframe = document.createElement('iframe');
        //iframe.style.display = 'none';
        iframe.src = blobUrl;

        iframe.onload = () => {
          iframe.contentWindow?.print();
          // Cleanup after print dialog closes
          setTimeout(() => {
            //  URL.revokeObjectURL(blobUrl);
            //  document.body.removeChild(iframe);
          }, 1000);
        };

        document.body.appendChild(iframe);
      }
    }
  };

  return (<Box sx={{ flexGrow: 1 }} >
    <NotificationComponent />
    <Box sx={{ flexGrow: 1 }} className="statement-container">
      <Box sx={{ flexGrow: 1 }} className="page_wrap_height">
        <Box sx={{ flexGrow: 1, display: 'flex', paddingTop: 0 }} className="page_wrap_height_title">
          <h1 className="h_title">
            <p className="title-dept">{department ? t(`MAIN.MENU.${department?.toUpperCase().replace('-', '_')}`) : ''}</p>
            <span >&nbsp;{t('MAIN.STATEMENT')}</span>
          </h1>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className="h_title_right">
            <Button className="print_btn" onClick={handlePrintPdf}>
              <LocalPrintshopIcon />
              <span className="print_text">&nbsp;{t('MAIN.PRINT_STATEMENT')}</span>
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, flexDirection: 'column', marginRight: '10px' }} className="h_title_right">
            <span className="header-balance-text">{t('INVOICES.RATES.CURRENT_BALANCE')}</span>
            <span className="header-balance-value">
              {currency.format(balance?.currentBalance || 0)}
            </span>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} className="page_wrap_height_content">
          {department === 'rates' && <RatesStatementComponent setStatementQueryParams={setDto} department={department} getBalance={getBalance} balance={balance} />}
          {department === 'rents' && <RentsStatementComponent department={department} getBalance={getBalance} balance={balance} />}
          {department === 'loans' && <LoansStatementComponent department={department} getBalance={getBalance} balance={balance} />}
          {department === 'loan-info' && <LoanInfoStatementComponent department={department} />}
          {department === 'documents' && <DocumentsStatementComponent department={department} />}
        </Box>
      </Box>
    </Box>
  </Box>);
};

