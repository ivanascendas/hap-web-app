import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../Invoices.component.scss";
import moment from "moment";
import currency from "@shared/utils/currency";
import { useAuth } from "@shared/providers/Auth.provider";
import { ColumnItem, TableComponent } from "@shared/components/Table.component";
import { BalanceRequestDto } from "@shared/dtos/balance-request.dto";
import { BalanceDto } from "@shared/dtos/balance.dto";
import { MobileInvoicesListComponent } from "./MobileInvoicesList.component";
import { useDispatch, useSelector } from "react-redux";
import DownloadForOfflineIcon from "@mui/icons-material/Download";
import { InvoiceDto, InvoiceQueryParams } from "@shared/dtos/invoice.dtos";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import {
  useLazyDownloadInvoicePdfQuery,
  useLazyGetInvoicesQuery,
} from "@shared/services/Payment.service";
import {
  selectInvoices,
  setInvoicesToPay,
} from "@shared/redux/slices/paymentSlice";
import { useLazyGetPropertiesQuery } from "@shared/services/Statements.service";
import EastIcon from "@mui/icons-material/East";
import { setError } from "@shared/redux/slices/errorSlice";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { InvoicePaymentPopupСomponent } from "./InvoicePaymentPopup.component";
import { PaymentDto } from "@shared/dtos/payments.dto";
import { SummaryBoxComponent } from "@components/common/components/summary-box.component";

export type RatesInvoiceProps = {
  department: string;
  setInvoiceQueryParams: (dto: InvoiceQueryParams) => void;
  getBalance: (dto: BalanceRequestDto) => QueryActionCreatorResult<any>;
  balance: BalanceDto | undefined;
};

/**
 * The `RatesInvoicesComponent` is a React component that displays a table of invoices for a specific department, along with a summary of the current balance and the ability to select and pay invoices.
 *
 * The component receives the following props:
 * - `department`: a string representing the department for which the invoices are being displayed.
 * - `getBalance`: a function that retrieves the current balance for the selected property and time period.
 * - `balance`: an object containing the current balance information.
 * - `setInvoiceQueryParams`: a function that sets the query parameters for retrieving the invoices.
 *
 * The component uses various hooks and services to fetch the necessary data, handle user interactions, and manage the state of the selected invoices. It also includes a mobile-friendly version of the invoice list and a payment popup component.
 */

export const RatesInvoicesComponent = ({
  department,
  getBalance,
  balance,
  setInvoiceQueryParams,
}: RatesInvoiceProps): JSX.Element => {
  const [selectedProperty, setSelectedProperty] = useState("0");
  const [selectedPeriod, setSelectedPeriod] = useState("current_year");

  const [open, setOpen] = useState(false);

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
  const [selectedInvoices, setSelectedInvoices] = useState<number>(
    payments.reduce((sum, obj) => sum + (Number(obj.pending) || 0), 0),
  );

  /**
   * Handles the checkbox change event for an invoice row.
   *
   * When the checkbox is checked, the corresponding input field is enabled and the invoice amount is added to the `selectedInvoices` object.
   * When the checkbox is unchecked, the corresponding input field is disabled and the invoice amount is removed from the `selectedInvoices` object.
   *
   * @param e - The change event object for the checkbox.
   * @param row - The invoice row object.
   */
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
        setSelectedInvoices(
          selectedInvoices -
            (Number(input.value.replace(/[^0-9.-]+/g, "")) || 0),
        );
      } else {
        const numericValue = Number(input.value.replace(/[^0-9.-]+/g, ""));

        setSelectedInvoices(numericValue);
      }
    }
  };

  /**
   * Handles the download of an invoice PDF for the given invoice row.
   *
   * If the invoice row has a valid `voucherNo` and `sequenceNo`, this function will attempt to download the corresponding invoice PDF using the `downloadInvoice` function.
   * If an error occurs during the download, it will be logged and an error message will be dispatched to the Redux store.
   *
   * @param row - The invoice row object containing the necessary information to download the PDF.
   */
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

  /**
   * Handles the change event for an invoice amount input field.
   *
   * This function is called when the value of an invoice amount input field changes. It extracts the numeric value from the input field, updates the `selectedInvoices` object with the new value, and sets the updated `selectedInvoices` object in the component's state.
   *
   * @param e - The change event object for the input field.
   * @param row - The invoice row object associated with the input field.
   */
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    row: InvoiceDto,
  ) => {
    const { value } = e.target;
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ""));
    setSelectedInvoices(numericValue);
  };

  /**
   * Handles the closing of the invoice payment modal.
   *
   * This function is called when the user wants to close the invoice payment modal. It sets the `open` state to `false` and resets the `selectedInvoices` object to an empty object.
   */
  const handleClose = () => {
    setOpen(false);
    setSelectedInvoices(0);
  };

  /**
   * Handles the payment of selected invoices.
   *
   * This function is called when the user wants to pay the selected invoices. It creates an array of `PaymentDto` objects from the `selectedInvoices` object, which contains the invoice numbers, sequence numbers, and the amounts to pay. The function then dispatches an action to set the `invoicesToPay` in the Redux store and closes the invoice payment modal.
   */

  const payHandler = () => {
    const invoicesToPay: PaymentDto[] = [
      {
        VoucherNo: "0",
        SequenceNo: "0",
        AmountToPay: selectedInvoices,
        incDept: department,
        Name: "",
        Number: "",
        Address1: "",
        Address2: "",
        Address3: "",
        County: "",
        phoneCode: "",
        City: "",
        Country: "",
        Email: "",
        Phone: "",
        Zipcode: "",
      },
    ];

    dispatch(setInvoicesToPay(invoicesToPay));
    handleClose();
    navigate("/payment/info");
  };

  const columns: ColumnItem<InvoiceDto>[] = [
    /* {
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
    },*/
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
          <IconButton
            aria-label={`download ${row.invoiceNo} pdf`}
            onClick={() => invoiceDownloadHandler(row)}
          >
            <DownloadForOfflineIcon />
          </IconButton>
        </Box>
      ),
    },
    {
      key: "total",
      label: "INVOICES.RATES.COLUMNS.BALANCE",
      rowRender: (row: InvoiceDto) => (
        <Box className={`balance `}>
          {currency.format(row.total || 0)}
          <span className={row.totalPaid && row.totalPaid > 0 ? "success" : ""}>
            {currency.format(row.totalPaid || 0)} paid
          </span>
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
            variant="standard"
            onChange={(e) => handleAmountChange(e, row)}
            value={currency.format(selectedInvoices || row.pending || 0)}
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
      const propReq = getProperties();
      const balanceReq = getBalance({
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

  console.log("selectedInvoices", selectedInvoices);
  return (
    <Box sx={{ position: "relative", height: "calc(100vh - 11rem)" }}>
      <Box className=" ">
        <Box
          className=" personal_box personal_box_content"
          sx={{
            display: {
              xs: "none",
              md: "block",
              borderRadius: "2rem",
              padding: 0,
            },
          }}
        >
          <TableComponent
            aria-label="rates table"
            isLoading={isRatesLoading}
            columns={columns}
            rows={[
              payments.reduce<InvoiceDto>(
                (acc, payment) => {
                  acc.statementDate =
                    payment.statementDate || acc.statementDate;
                  acc.invoiceNo = payment.invoiceNo || acc.invoiceNo;
                  acc.propertyDescription =
                    payment.propertyDescription || acc.propertyDescription;
                  acc.total = (acc.total || 0) + (payment.total || 0);
                  acc.totalPaid =
                    (acc.totalPaid || 0) + (payment.totalPaid || 0);
                  acc.pending = (acc.pending || 0) + (payment.pending || 0);
                  acc.voucherNo = 0;
                  acc.sequenceNo = 0;
                  return acc;
                },
                {
                  invoiceNo: "",
                  propertyDescription: "",
                  total: 0,
                  totalPaid: 0,
                  pending: 0,
                  voucherNo: 0,
                  sequenceNo: 0,
                  issuedOn: null,
                  dueDate: null,
                },
              ),
            ]}
            selected={(row) =>
              Object.keys(selectedInvoices).some(
                (s) => s === `${row.invoiceNo}_${row.sequenceNo}_input`,
              )
            }
            className="rates_invoice_table"
          />
        </Box>
      </Box>
      <SummaryBoxComponent
        value={selectedInvoices}
        currentBalance={balance?.currentBalance}
        onClick={payHandler}
      />

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

      {Object.values(selectedInvoices).length > 0 && (
        <InvoicePaymentPopupСomponent
          handleAmountChange={handleAmountChange}
          selectedInvoices={selectedInvoices}
          payHandler={payHandler}
          open={open}
          onClose={handleClose}
        />
      )}
    </Box>
  );
};
