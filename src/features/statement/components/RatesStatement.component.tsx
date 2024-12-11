import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Skeleton,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../Statement.component.scss";
import {
  useLazyGetPropertiesQuery,
  useLazyGetStatementsQuery,
} from "../../../shared/services/Statements.service";
import moment from "moment";
import currency from "../../../shared/utils/currency";
import { useAuth } from "../../../shared/providers/Auth.provider";
import {
  StatementDto,
  StatementQueryParams,
} from "../../../shared/dtos/statement.dtos";
import {
  ColumnItem,
  TableComponent,
} from "../../../shared/components/Table.component";
import { BalanceRequestDto } from "../../../shared/dtos/balance-request.dto";
import { BalanceDto } from "../../../shared/dtos/balance.dto";
import { MobileStatementsListComponent } from "./MobileStatementsList.component";
import { useDispatch, useSelector } from "react-redux";
import {
  clearStatements,
  selectStatements,
  selectStatementsCount,
} from "../../../shared/redux/slices/statementSlice";
import { InvoicePopupСomponent } from "./InvoicePopup.component";
import { InvoiceInputRequest } from "../../../shared/dtos/invoice.dtos";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/query";

export type RatesStatementProps = {
  department: string;
  setStatementQueryParams: (dto: StatementQueryParams) => void;
  getBalance: (dto: BalanceRequestDto) => QueryActionCreatorResult<any>;
  balance: BalanceDto | undefined;
};

export const RatesStatementComponent = ({
  department,
  getBalance,
  balance,
  setStatementQueryParams,
}: RatesStatementProps): JSX.Element => {
  const [selectedProperty, setSelectedProperty] = useState("0");
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("current_year");
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceInputRequest | null>(null);
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [getProperties, { data: properties, isFetching }] =
    useLazyGetPropertiesQuery();
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
        moment(row.statementDate).format("DD/MM/YYYY"),
    },
    { key: "transType", label: "RATES.COLUMNS.TRANSACTION" },
    { key: "invoiceNo", label: "RATES.COLUMNS.REFERENCE" },
    { key: "propertyDescription", label: "RATES.COLUMNS.PROPERTY" },
    {
      key: "amount",
      label: "RATES.COLUMNS.AMOUNT",
      rowRender: (row: StatementDto) => currency.format(row.amount),
      rowClassName: (row: StatementDto) =>
        row.transType == "Invoice" ? "text_red" : "clr_green",
    },
    {
      key: "balance",
      label: "RATES.COLUMNS.BALANCE",
      rowRender: (row: StatementDto) => currency.format(row.balance),
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
      var propReq = getProperties();
      var balanceReq = getBalance({
        incDept: department.toUpperCase(),
        PropertyNumber: selectedProperty,
        from:
          selectedPeriod === "current_year"
            ? moment().startOf("year").format("YYYY-MM-DD")
            : moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      });
      var statementsReq = getStatements({
        $inlinecount: "allpages",
        IncDept: department.toUpperCase(),
        $orderby: "ROW_NUMBER asc",
        $skip: page * 50,
        $top: 50,
        from:
          selectedPeriod === "current_year"
            ? moment().startOf("year").format("YYYY-MM-DD")
            : moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      });

      return () => {
        balanceReq.abort();
        propReq.abort();
        statementsReq.abort();
        dispatch(clearStatements());
      };
    }
  }, [isAuthenticated, selectedProperty, selectedPeriod]);

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
      <Box className="personal_box ">
        <Box className="personal_box_filter">
          <Box>
            <FormControl fullWidth>
              <InputLabel id="property-select-label">
                {t("RATES.FILTER.PROPERTY")}
              </InputLabel>
              {isFetching ? (
                <Skeleton variant="rounded" width={"100%"} role="progressbar">
                  <Select
                    labelId="property-select-label"
                    label={t("RATES.FILTER.PROPERTY")}
                    value=""
                    disabled
                  >
                    <MenuItem value="">
                      {" "}
                      <CircularProgress size={20} /> Loading...
                    </MenuItem>
                  </Select>
                </Skeleton>
              ) : (
                properties &&
                properties.length > 0 && (
                  <Select
                    labelId="property-select-label"
                    label={t("RATES.FILTER.PROPERTY")}
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                  >
                    {properties?.map((property) => (
                      <MenuItem
                        key={property.propertyNumber}
                        value={property.propertyNumber}
                      >
                        {property.propertyDescription}
                      </MenuItem>
                    ))}
                  </Select>
                )
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel id="date-range-label">
                {t("RATES.FILTER.DATE_RANGE")}
              </InputLabel>
              <Select
                labelId="date-range-label"
                label={t("RATES.FILTER.DATE_RANGE")}
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="current_year">
                  {t("RATES.FILTER.DATE_RANGE_OPTIONS.CURRENT_YEAR")}
                </MenuItem>
                <MenuItem value="prev_year">
                  {t("RATES.FILTER.DATE_RANGE_OPTIONS.INCLUDE_PREVIOUS_YEAR")}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
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
            aria-label="rates table"
            isLoading={isRatesLoading}
            columns={columns}
            rows={statements.slice(page * 50, page * 50 + 50) || []}
            onItemClick={rateClickHandler}
            className="rates_table"
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
        <MobileStatementsListComponent
          isLoading={isFetching}
          onClick={rateClickHandler}
          list={statements || []}
          loadMore={handleLoadMore}
        />
      </Box>
      {selectedInvoice && (
        <InvoicePopupСomponent
          dto={selectedInvoice}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  );
};
