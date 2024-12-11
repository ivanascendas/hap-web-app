import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
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
import { BalanceRequestDto } from "../../../shared/dtos/balance-request.dto";
import { BalanceDto } from "../../../shared/dtos/balance.dto";
import { MobileInvoicesListComponent } from "./MobileInvoicesList.component";
import { useDispatch, useSelector } from "react-redux";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import {
  InvoiceDownloadRequest,
  InvoiceDto,
  InvoiceInputRequest,
  InvoiceQueryParams,
} from "../../../shared/dtos/invoice.dtos";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import {
  useLazyDownloadInvoicePdfQuery,
  useLazyGetInvoicesQuery,
} from "../../../shared/services/Payment.service";
import {
  selectInvoices,
  selectInvoicesCount,
} from "../../../shared/redux/slices/paymentSlice";
import { useLazyGetPropertiesQuery } from "../../../shared/services/Statements.service";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { setError } from "../../../shared/redux/slices/errorSlice";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { InvoicePaymentPopupСomponent } from "./InvoicePaymentPopup.component";

export type RatesInvoiceProps = {
  department: string;
  setInvoiceQueryParams: (dto: InvoiceQueryParams) => void;
  getBalance: (dto: BalanceRequestDto) => QueryActionCreatorResult<any>;
  balance: BalanceDto | undefined;
};

export const RatesInvoicesComponent = ({
  department,
  getBalance,
  balance,
  setInvoiceQueryParams,
}: RatesInvoiceProps): JSX.Element => {
  const [selectedProperty, setSelectedProperty] = useState("0");
  const [selectedPeriod, setSelectedPeriod] = useState("current_year");

  const [open, setOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<{
    [key: string]: number;
  }>({});
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [getProperties, { data: properties, isFetching }] =
    useLazyGetPropertiesQuery();
  const [downloadInvoice] = useLazyDownloadInvoicePdfQuery();
  const [getInvoices, { data, isFetching: isRatesLoading }] =
    useLazyGetInvoicesQuery();
  const payments = useSelector(selectInvoices);

  const checkBoxHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: InvoiceDto,
  ) => {
    const { checked } = e.target;
    const id = `${row.invoiceNo}_${row.sequenceNo}_input`;
    const input: HTMLInputElement | null = document.getElementById(
      id,
    ) as HTMLInputElement | null;
    if (input) {
      if (!checked) {
        delete selectedInvoices[id];
        input.disabled = true;
        setSelectedInvoices({ ...selectedInvoices });
      } else {
        const numericValue = Number(input.value.replace(/[^0-9.-]+/g, ""));
        selectedInvoices[id] = numericValue;
        setSelectedInvoices({ ...selectedInvoices, [id]: numericValue });
      }
    }
  };

  const invoiceDownloadHandler = async (row: InvoiceDto) => {
    if (row.voucherNo && row.sequenceNo) {
      try {
        await downloadInvoice({
          VoucherNo: row.voucherNo,
          SequenceNo: row.sequenceNo,
        });
      } catch (error) {
        console.warn(error);
        dispatch(setError({ message: `download invoice error` }));
      }
    }
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    row: InvoiceDto,
  ) => {
    const { value } = e.target;
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ""));
    const id = `${row.invoiceNo}_${row.sequenceNo}_input`;
    selectedInvoices[id] = numericValue;
    setSelectedInvoices({ ...selectedInvoices, [id]: numericValue });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInvoices({ ...{} });
  };

  const columns: ColumnItem<InvoiceDto>[] = [
    {
      key: "statementDate",
      label: "INVOICES.RENTS.COLUMNS.DATE",
      rowRender: (row: InvoiceDto) =>
        moment(row.statementDate).format("DD MMM YYYY"),
    },
    {
      key: "invoiceNo",
      label: "INVOICES.RENTS.COLUMNS.REFERENCE",
      rowRender: (row: InvoiceDto) => (
        <Box className="invoice-no">
          {row.invoiceNo}{" "}
          <IconButton onClick={() => invoiceDownloadHandler(row)}>
            <DownloadForOfflineIcon />
          </IconButton>
        </Box>
      ),
    },
    { key: "propertyDescription", label: "INVOICES.RATES.COLUMNS.PROPERTY" },
    {
      key: "total",
      label: "INVOICES.RATES.COLUMNS.BALANCE",
      rowRender: (row: InvoiceDto) => (
        <Box className="balance">
          {currency.format(row.total || 0)}
          <span>{currency.format(row.totalPaid || 0)} paid</span>
        </Box>
      ),
    },
    {
      key: "totalPaid",
      label: "INVOICES.RENTS.COLUMNS.AMOUNT_TO_PAY",
      rowRender: (row: InvoiceDto) => (
        <>
          <TextField
            id={`${row.invoiceNo}_${row.sequenceNo}_input`}
            slotProps={{
              htmlInput: {
                "aria-label": `pay ${currency.format(row.pending || 0)} input`,
              },
            }}
            onChange={(e) => handleAmountChange(e, row)}
            value={currency.format(
              selectedInvoices[`${row.invoiceNo}_${row.sequenceNo}_input`] ||
                row.pending ||
                0,
            )}
            disabled={
              !Object.keys(selectedInvoices).some(
                (s) => s === `${row.invoiceNo}_${row.sequenceNo}_input`,
              )
            }
          />
        </>
      ),
    },
    {
      key: "totalPaid",
      label: "",
      colRnder: () => "Apply",
      rowRender: (row: InvoiceDto) => (
        <>
          <Checkbox
            onChange={(e) => checkBoxHandler(e, row)}
            inputProps={{
              "aria-labelledby": `${row.invoiceNo}_${row.sequenceNo}_checkbox`,
              "aria-label": `enable pay ${currency.format(row.pending || 0)} input`,
            }}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setInvoiceQueryParams({
        incDept: department.toUpperCase(),
        $orderby: "ROW_NUMBER asc",
      });
      var propReq = getProperties();
      var balanceReq = getBalance({
        incDept: department.toUpperCase(),
        PropertyNumber: selectedProperty,
        from:
          selectedPeriod === "current_year"
            ? moment().startOf("year").format("YYYY-MM-DD")
            : moment().startOf("year").format("YYYY-MM-DD"),
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
        propReq.abort();
        invoicesReq.abort();
      };
    }
  }, [isAuthenticated, selectedProperty, selectedPeriod]);

  return (
    <>
      <Box className="personal_box ">
        <Box className="personal_box_filter">
          <Box>
            <FormControl fullWidth>
              <InputLabel id="property-select-label">
                {t("INVOICES.RATES.FILTER.NAME")}
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
                    {properties?.map((p) => (
                      <MenuItem key={p.propertyNumber} value={p.propertyNumber}>
                        {p.propertyDescription}
                      </MenuItem>
                    ))}
                  </Select>
                )
              )}
            </FormControl>
          </Box>
          <Box
            className="personal_box_filter_balance"
            sx={{ display: "flex", flexDirection: "column" }}
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
            rows={payments || []}
            className="rates_invoice_table"
          />

          <Box
            className="personal_box_footer"
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
            }}
          >
            <Box
              className="personal_box_filter_balance"
              sx={{ display: "flex" }}
            >
              <span className="personal_box_filter_value">
                {t("LABELS.TOTAL")}:{" "}
                {currency.format(
                  Object.values(selectedInvoices).reduce((a, b) => a + b, 0),
                )}
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0.625rem 2.1875rem",
        }}
      >
        <Button
          onClick={() => navigate("/statements/rates")}
          startIcon={<WestIcon />}
        >
          {t("BUTTONS.BACK_TO_STATEMENTS")}
        </Button>
        <Button
          sx={{ width: "33%", padding: "0.9375rem" }}
          disabled={Object.values(selectedInvoices).length === 0}
          className="btn btn-primary"
          variant="contained"
          endIcon={<EastIcon />}
          onClick={() => {}}
        >
          {t("PAYMENT.PAY_NOW")}
        </Button>
      </Box>
      <Box
        className="personal_box_content"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        <MobileInvoicesListComponent
          isLoading={isRatesLoading}
          selectedInvoices={selectedInvoices}
          list={payments || []}
          onClick={checkBoxHandler}
        />
      </Box>
      <Box
        className="mobile-button"
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Button
          endIcon={<KeyboardArrowRightIcon />}
          onClick={() => setOpen(true)}
          className="btn btn-primary table-statements-mobile_button"
          disabled={Object.values(selectedInvoices).length === 0}
          variant="contained"
        >
          {t("CONTENTS.BUTTON.CONTINUE")}
        </Button>
      </Box>
      {Object.values(selectedInvoices).length > 0 && (
        <InvoicePaymentPopupСomponent
          handleAmountChange={handleAmountChange}
          selectedInvoices={selectedInvoices}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  );
};
