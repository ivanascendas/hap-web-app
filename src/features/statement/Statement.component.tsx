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

export const StatementComponent = (): JSX.Element => {
  const { department } = useParams();
  const { t } = useTranslation();
  return (<Box sx={{ flexGrow: 1 }} >
    <NotificationComponent />
    <Box sx={{ flexGrow: 1 }} className="statement-container">
      <Box sx={{ flexGrow: 1 }} className="page_wrap_height">
        <Box sx={{ flexGrow: 1 }} className="page_wrap_height_title">
          <Box sx={{ flexGrow: 1 }} className="h_title">
            <p className="title-dept">{department ? t(`MAIN.MENU.${department?.toUpperCase().replace('-', '_')}`) : ''}</p>
            <span >&nbsp;{t('MAIN.STATEMENT')}</span>
          </Box>
          <Box sx={{ flexGrow: 1 }} className="h_title_right">
            <Button className="print_btn" >
              <LocalPrintshopIcon />
              <span className="print_text">&nbsp;{t('MAIN.PRINT_STATEMENT')}</span>
            </Button>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} className="page_wrap_height_content">
          {department === 'rates' && <RatesStatementComponent department={department} />}
          {department === 'rents' && <RentsStatementComponent department={department} />}
          {department === 'loans' && <LoansStatementComponent department={department} />}
          {department === 'loan-info' && <LoanInfoStatementComponent department={department} />}
          {department === 'documents' && <DocumentsStatementComponent department={department} />}
        </Box>
      </Box>
    </Box>
  </Box>);
};
