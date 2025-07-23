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

export const MonthlyInvoiceComponent = ({
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
  const [getProperties] = useLazyGetPropertiesQuery();
  const [downloadInvoice] = useLazyDownloadInvoicePdfQuery();
  const [getInvoices, { isFetching: isRatesLoading }] =
    useLazyGetInvoicesQuery();
  const payments = useSelector(selectInvoices);
  const [sortedPayments, setSortedPayments] = useState<{
    [monthYear: string]: InvoiceDto[];
  }>(
    payments.reduce(
      (acc, payment) => {
        const monthYear = moment(payment.statementDate).format("MMMM, YYYY");
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(payment);
        return acc;
      },
      {} as { [monthYear: string]: InvoiceDto[] },
    ),
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
    const id = `${row.invoiceNo}_${row.sequenceNo}_input`;
    selectedInvoices[id] = numericValue;
    setSelectedInvoices({ ...selectedInvoices, [id]: numericValue });
  };

  /**
   * Handles the closing of the invoice payment modal.
   *
   * This function is called when the user wants to close the invoice payment modal. It sets the `open` state to `false` and resets the `selectedInvoices` object to an empty object.
   */
  const handleClose = () => {
    setOpen(false);
    setSelectedInvoices({ ...{} });
  };

  /**
   * Handles the payment of selected invoices.
   *
   * This function is called when the user wants to pay the selected invoices. It creates an array of `PaymentDto` objects from the `selectedInvoices` object, which contains the invoice numbers, sequence numbers, and the amounts to pay. The function then dispatches an action to set the `invoicesToPay` in the Redux store and closes the invoice payment modal.
   */

  const payHandler = () => {
    const invoicesToPay: PaymentDto[] = Object.keys(selectedInvoices)
      .map((key) => {
        const [invoiceNo, sequenceNo] = key.split("_");
        const row = payments.find(
          (p) =>
            p.invoiceNo === invoiceNo && p.sequenceNo === parseInt(sequenceNo),
        );
        return row
          ? {
              VoucherNo: row.voucherNo?.toString() ?? "",
              SequenceNo: row.sequenceNo?.toString() ?? "",
              AmountToPay: selectedInvoices[key],
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
            }
          : null;
      })
      .filter((row): row is PaymentDto => row !== null);

    dispatch(setInvoicesToPay(invoicesToPay));
    handleClose();
    navigate("/payment/info");
  };

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

  useEffect(() => {
    const newSortedPayments: { [monthYear: string]: InvoiceDto[] } =
      payments.reduce(
        (acc, payment) => {
          const monthYear = moment(payment.statementDate).format("MMMM, YYYY");
          if (!acc[monthYear]) {
            acc[monthYear] = [];
          }
          acc[monthYear].push(payment);
          return acc;
        },
        {} as { [monthYear: string]: InvoiceDto[] },
      );
    setSortedPayments(newSortedPayments);
  }, [payments]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        height: { md: "calc(100vh - 11rem)", xs: "calc(100vh - 21rem)" },
      }}
    >
      <Box className="month_invoices_container">
        <Box
          className="month_invoices_content"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 2,
            gap: "1rem",
          }}
        >
          {Object.keys(sortedPayments).map((monthYear) => (
            <Box key={monthYear} className={`personal_box month_invoices`}>
              <Typography className="month_invoices_title" variant="h6">
                {monthYear}
              </Typography>
              <Box className="month_invoices_item_content">
                {sortedPayments[monthYear].map((row) => (
                  <Box
                    key={`${row.invoiceNo}_${row.sequenceNo}`}
                    className={`month_invoices_item ${
                      !selectedInvoices[
                        `${row.invoiceNo}_${row.sequenceNo}_input`
                      ]
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Checkbox
                        onChange={(e) => checkBoxHandler(e, row)}
                        inputProps={{
                          "aria-labelledby": `${row.invoiceNo}_${row.sequenceNo}_checkbox`,
                          "aria-label": `enable pay ${currency.format(row.pending || 0)} input`,
                        }}
                      />
                      <Typography component={"span"} className="invoice-date">
                        {moment(row.statementDate).format("DD MMMM")}
                      </Typography>
                    </Box>
                    <Box className="month_invoices_item_input">
                      <TextField
                        fullWidth
                        disabled={
                          !selectedInvoices[
                            `${row.invoiceNo}_${row.sequenceNo}_input`
                          ]
                        }
                        id={`${row.invoiceNo}_${row.sequenceNo}_input`}
                        type="text"
                        value={currency.format(
                          selectedInvoices[
                            `${row.invoiceNo}_${row.sequenceNo}_input`
                          ] ||
                            row.pending ||
                            0,
                        )}
                        variant={"standard"}
                        onChange={(e) => handleAmountChange(e, row)}
                        inputProps={{
                          "aria-label": `amount to pay for ${row.invoiceNo}`,
                        }}
                      />
                      <Box className="month_invoices_item_input_pending">
                        {currency.format(row.pending || 0)}
                      </Box>
                      <Box className="balance" sx={{ padding: "0.5rem" }}>
                        <span
                          className={
                            row.totalPaid && row.totalPaid > 0 ? "success" : ""
                          }
                        >
                          {currency.format(row.totalPaid || 0)} paid
                        </span>
                      </Box>
                    </Box>
                    <Box className="month_invoices_item_paid"></Box>
                  </Box>
                ))}
                {sortedPayments[monthYear].map((row) => (
                  <Box
                    key={`${row.invoiceNo}_${row.sequenceNo}1`}
                    className={`month_invoices_item ${
                      !selectedInvoices[
                        `${row.invoiceNo}_${row.sequenceNo}_1_input`
                      ]
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Checkbox
                        onChange={(e) => checkBoxHandler(e, row)}
                        inputProps={{
                          "aria-labelledby": `${row.invoiceNo}_${row.sequenceNo}_checkbox`,
                          "aria-label": `enable pay ${currency.format(row.pending || 0)} input`,
                        }}
                      />
                      <Typography component={"span"} className="invoice-date">
                        {moment(row.statementDate).format("DD MMMM")}
                      </Typography>
                    </Box>
                    <Box className="month_invoices_item_input">
                      <TextField
                        fullWidth
                        disabled={
                          !selectedInvoices[
                            `${row.invoiceNo}_${row.sequenceNo}_input`
                          ]
                        }
                        id={`${row.invoiceNo}_${row.sequenceNo}_input`}
                        type="text"
                        value={currency.format(
                          selectedInvoices[
                            `${row.invoiceNo}_${row.sequenceNo}_input`
                          ] ||
                            row.pending ||
                            0,
                        )}
                        variant={"standard"}
                        onChange={(e) => handleAmountChange(e, row)}
                        inputProps={{
                          "aria-label": `amount to pay for ${row.invoiceNo}`,
                        }}
                      />
                      <Box className="month_invoices_item_input_pending">
                        {currency.format(row.pending || 0)}
                      </Box>
                      <Box className="balance" sx={{ padding: "0.5rem" }}>
                        <span
                          className={
                            row.totalPaid && row.totalPaid > 0 ? "success" : ""
                          }
                        >
                          {currency.format(row.totalPaid || 0)} paid
                        </span>
                      </Box>
                    </Box>
                    <Box className="month_invoices_item_paid"></Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
          <SummaryBoxComponent
            variant="light"
            value={Object.values(selectedInvoices).reduce(
              (acc, value) => acc + value,
              0,
            )}
            currentBalance={balance?.currentBalance}
            onClick={payHandler}
          />
        </Box>
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

        <SummaryBoxComponent
          variant="light"
          value={Object.values(selectedInvoices).reduce(
            (acc, value) => acc + value,
            0,
          )}
          currentBalance={balance?.currentBalance}
          onClick={payHandler}
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
