import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Skeleton,
  Switch,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../Statement.component.scss";
import {
  useLazyGetPropertiesQuery,
  useLazyGetStatementsQuery,
} from "@shared/services/Statements.service";
import moment from "moment";
import currency from "@shared/utils/currency";
import { useAuth } from "@shared/providers/Auth.provider";
import {
  StatementDto,
  StatementQueryParams,
} from "@shared/dtos/statement.dtos";
import { ColumnItem, TableComponent } from "@shared/components/Table.component";
import { BalanceRequestDto } from "@shared/dtos/balance-request.dto";
import { BalanceDto } from "@shared/dtos/balance.dto";
import { MobileStatementsListComponent } from "./MobileStatementsList.component";
import { useDispatch, useSelector } from "react-redux";
import {
  clearStatements,
  selectStatements,
  selectStatementsCount,
} from "@shared/redux/slices/statementSlice";
import { InvoicePopupComponent } from "./InvoicePopup.component";
import { InvoiceInputRequest } from "@shared/dtos/invoice.dtos";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import { TablePaginationActions } from "@shared/components/TablePaginationActions";

export type RatesStatementProps = {
  includePreviousYear: boolean;
  department: string;
  setStatementQueryParams: (dto: StatementQueryParams) => void;
  getBalance: (dto: BalanceRequestDto) => QueryActionCreatorResult<any>;
};

export const RatesStatementComponent = ({
  department,
  getBalance,
  setStatementQueryParams,
  includePreviousYear,
}: RatesStatementProps): JSX.Element => {
  const [selectedProperty] = useState("0");
  const [open, setOpen] = useState(false);
  const [selectedPeriod] = useState("current_year");
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceInputRequest | null>(null);
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const dispatch = useDispatch();
  const statements = useSelector(selectStatements);
  const statementCount = useSelector(selectStatementsCount);
  const [getStatements, { isFetching: isRatesLoading }] =
    useLazyGetStatementsQuery();

  const columns: ColumnItem<StatementDto>[] = [
    {
      key: "statementDate",
      label: "RATES.COLUMNS.DATE",
      rowRender: (row: StatementDto) =>
        moment(row.statementDate).format("DD MMM. YYYY"),
    },
    { key: "transType", label: "RATES.COLUMNS.TRANSACTION" },
    { key: "invoiceNo", label: "RATES.COLUMNS.REFERENCE" },
    {
      key: "amount",
      label: "RATES.COLUMNS.AMOUNT",
      rowRender: (row: StatementDto) => currency.format(row.amount),
      rowClassName: (row: StatementDto) =>
        row.amount > 0 ? "strong" : "strong__negative",
    },
    {
      key: "balance",
      label: "RATES.COLUMNS.BALANCE",
      rowRender: (row: StatementDto) => currency.format(row.balance),
      rowClassName: (row: StatementDto) =>
        row.balance > 0 ? "strong" : "strong__negative",
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setStatementQueryParams({
        IncDept: department.toUpperCase(),
        $orderby: "ROW_NUMBER asc",
        from:
          selectedPeriod === "current_year"
            ? moment().startOf("year").format("YYYY-MM-DD")
            : moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      });
      const balanceReq = getBalance({
        incDept: department.toUpperCase(),
        PropertyNumber: selectedProperty,
        from: !includePreviousYear
          ? moment().startOf("year").format("YYYY-MM-DD")
          : moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      });
      const statementsReq = getStatements({
        $count: true,
        IncDept: department.toUpperCase(),
        $orderby: "SequenceNumber asc",
        // $orderby: "roW_NUMBER asc",

        $skip: page * 50,
        $top: 50,
        from: !includePreviousYear
          ? moment().startOf("year").format("YYYY-MM-DD")
          : moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      });

      return () => {
        balanceReq.abort();
        statementsReq.abort();
        dispatch(clearStatements());
      };
    }
  }, [isAuthenticated, selectedProperty, includePreviousYear]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = () => {
    setPage(0);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInvoice(null);
  };

  function rateClickHandler(row: StatementDto): void {
    setOpen(true);
    setSelectedInvoice({
      voucherNo: row.voucherNo,
      sequenceNo: row.sequenceNo,
      incDept: department.toUpperCase(),
    });
  }

  return (
    <>
      <Box className="rates_statement_container">
        <Box
          className="personal_box_filter"
          sx={{ margin: { xs: "0.5rem", md: "0 2.25rem" } }}
        >
          <Box sx={{ flex: "2" }}></Box>
        </Box>
        <Box
          className=" personal_box personal_box_content"
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <TableComponent
            aria-label="rates table"
            isLoading={isRatesLoading}
            columns={columns}
            rows={statements.slice(page * 50, page * 50 + 50) || []}
            onItemClick={rateClickHandler}
            className=" rates_table"
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
              ActionsComponent={TablePaginationActions}
            />
            {/* <Box
              className="personal_box_filter_balance"
              sx={{ display: "flex" }}
            >
              <span className="personal_box_filter_title">
                {t("RATES.CLOSING_BALANCE")}
              </span>
              <span className="personal_box_filter_value">
                {currency.format(balance?.closingBalance || 0)}
              </span>
            </Box> */}
          </Box>
        </Box>
      </Box>
      <Box
        className="personal_box_content"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        <MobileStatementsListComponent
          isLoading={false}
          onClick={rateClickHandler}
          list={statements || []}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
        />
      </Box>
      {selectedInvoice && (
        <InvoicePopupComponent
          dto={selectedInvoice}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  );
};
