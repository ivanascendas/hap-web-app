import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../Invoices.component.scss";
import moment from "moment";
import currency from "../../../shared/utils/currency";
import { useAuth } from "../../../shared/providers/Auth.provider";
import {
  ColumnItem,
  TableComponent,
} from "../../../shared/components/Table.component";
import { BaseQueryFn, QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import { BalanceRequestDto } from "../../../shared/dtos/balance-request.dto";
import { BalanceDto } from "../../../shared/dtos/balance.dto";
import { MobileInvoicesListComponent } from "./MobileInvoicesList.component";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetInvoicesQuery } from "../../../shared/services/Payment.service";
import {
  selectInvoices,
  selectInvoicesCount,
} from "../../../shared/redux/slices/paymentSlice";
import { InvoiceDto } from "../../../shared/dtos/invoice.dtos";

export type RentsInvoiceProps = {
  department: string;
  getBalance: (dto: BalanceRequestDto) => QueryActionCreatorResult<any>;
  balance: BalanceDto | undefined;
};

export const RentsInvoiceComponent = ({
  department,
  getBalance,
  balance,
}: RentsInvoiceProps): JSX.Element => {
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const statements = useSelector(selectInvoices);
  const statementCount = useSelector(selectInvoicesCount);
  const [getInvoices, { isFetching }] = useLazyGetInvoicesQuery();

  const columns: ColumnItem<InvoiceDto>[] = [
    {
      key: "statementDate",
      label: "RATES.COLUMNS.DATE",
      rowRender: (row: InvoiceDto) =>
        moment(row.statementDate).format("DD/MM/YYYY"),
    },
    { key: "invoiceNo", label: "RATES.COLUMNS.REFERENCE" },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      const balanceReq = getBalance({
        incDept: department.toUpperCase(),
        PropertyNumber: "0",
        from: moment().startOf("year").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      });
      const invoicesReq = getInvoices({
        incDept: department.toUpperCase(),
        $orderby: "StatementDate",
        $filter: `IncDept eq '${department.toUpperCase()}'`,
        $skip: 0,
        $top: 1000,
      });

      return () => {
        balanceReq.abort();
        invoicesReq.abort();
      };
    }
  }, [isAuthenticated, page]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPage(0);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <>
      <Box className="personal_box ">
        <Box className="personal_box_filter">
          <Box
            className="personal_box_filter_balance"
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            <span className="personal_box_filter_title">
              {t("INVOICES.RATES.CURRENT_BALANCE")}
            </span>
            <span className="personal_box_filter_value">
              {currency.format(balance?.currentBalance || 0)}
            </span>
          </Box>
        </Box>
        <Box
          className="personal_box_content"
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <TableComponent
            isLoading={isFetching}
            aria-label="rents table"
            columns={columns}
            rows={statements.slice(page * 50, 50) || []}
          />

          <Box
            className="personal_box_footer"
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[50]}
              component="div"
              count={statementCount || 0}
              rowsPerPage={50}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Box
              className="personal_box_filter_balance"
              sx={{ display: "flex" }}
            >
              <span className="personal_box_filter_title">
                {t("RATES.CLOSING_BALANCE")}
              </span>
              <span className="personal_box_filter_value">
                {currency.format(balance?.closingBalance || 0)}
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className="personal_box_content"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        <MobileInvoicesListComponent
          selectedInvoices={{}}
          list={statements || []}
          loadMore={handleLoadMore}
        />
      </Box>
    </>
  );
};
