import { Box, Button } from "@mui/material";
import { selectUser } from "@shared/redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "./Header.component.scss";
import currency from "@shared/utils/currency";
import { BalanceRequestDto } from "@shared/dtos/balance-request.dto";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import { BalanceDto } from "@shared/dtos/balance.dto";
export type HeaderStatementProps = {
  getBalance: (dto: BalanceRequestDto) => QueryActionCreatorResult<any>;
  balance: BalanceDto | undefined;
};
export const HeaderStatementComponent = ({
  getBalance,
  balance,
}: HeaderStatementProps): React.JSX.Element | JSX.Element | null => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  return (
    <Box sx={{ flexGrow: 1 }} className="statement-header">
      <Box sx={{ flex: 1 }}>
        {user && (
          <span>
            Hi, <strong>{user?.customerName}</strong> ✋
          </span>
        )}
      </Box>
      <Box
        sx={{
          flex: 0.5,
          display: { md: "flex" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="personal_box_filter_title">
          {t("INVOICES.RATES.CURRENT_BALANCE")}:
        </span>
        <span className="personal_box_filter_value  n">
          {currency.format(balance?.currentBalance || 0)}
        </span>
      </Box>
      <Button className="btn-secondary">Pay Now</Button>
    </Box>
  );
};
