import React, { useContext } from "react";
import "./InvoicePaymentPopup.component.scss";
import {
  Modal,
  Box,
  Tooltip,
  Button,
  Skeleton,
  Typography,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import currency from "../../../shared/utils/currency";
import { useSelector } from "react-redux";
import { selectInvoices } from "../../../shared/redux/slices/paymentSlice";
import { InvoiceDto } from "../../../shared/dtos/invoice.dtos";

export type InvoicePaymentPopupProps = {
  open: boolean;
  selectedInvoices: { [key: string]: number };
  handleAmountChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    row: InvoiceDto,
  ) => void;
  onClose: () => void;
};

export const InvoicePaymentPopupСomponent = ({
  open,
  onClose,
  selectedInvoices,
  handleAmountChange,
}: InvoicePaymentPopupProps): JSX.Element => {
  const payments = useSelector(selectInvoices);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="invoiuce modal"
      aria-describedby="invoiuce modal description"
    >
      <Box className="popup invoice_popup">
        {
          <>
            <Box className="invoice_popup_header">
              <span className="invoice_popup_header_title">
                {t("PAYMENT.ENTER_AMOUNT")}
              </span>
              <Tooltip title={t("BUTTONS.CLOSE")}>
                <CloseIcon onClick={onClose} />
              </Tooltip>
            </Box>
            <Box className="invoice_popup_content">
              {payments
                .filter(
                  (row) =>
                    selectedInvoices[
                      `${row.invoiceNo}_${row.sequenceNo}_input`
                    ],
                )
                .map((p, i) => (
                  <Box className="invoice_popup_content_block" key={i}>
                    <Box className="invoice_popup_content_block_content">
                      <Box className="invoice_popup_content_block_title">
                        {p.invoiceNo}
                      </Box>
                      <Box className="invoice_popup_content_block_content_amount">
                        <Typography
                          variant="body2"
                          component="strong"
                          className="invoice_popup_content_block_content_amount_title"
                        >
                          {t("PAYMENT.LABEL_BALANCE")}
                        </Typography>
                        <span className="invoice_popup_content_block_content_amount_value">
                          {currency.format(p.pending || 0)}
                        </span>
                        <div style={{ position: "relative" }}>
                          <label className="invoice_popup_content_block_content_amount_label">
                            {t("PAYMENT.ENTER_AMOUNT_HERE")}
                          </label>
                          <TextField
                            variant="outlined"
                            className="invoice_popup_content_block_content_amount_input"
                            onChange={(e) => handleAmountChange(e, p)}
                            title={t("PAYMENT.ENTER_AMOUNT_HERE")}
                            value={currency.format(
                              selectedInvoices[
                                `${p.invoiceNo}_${p.sequenceNo}_input`
                              ] ||
                                p.pending ||
                                0,
                            )}
                          />
                        </div>
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Box>
            <Box
              className="invoice_popup_content_footer"
              sx={{ flexDirection: "column" }}
            >
              <Box className="invoice_popup_content_footer_total">
                <span> {t("PAYMENT.PAYMENT_TOTAL")}</span>
                <span>
                  {" "}
                  {currency.format(
                    Object.values(selectedInvoices).reduce((a, b) => a + b, 0),
                  )}
                </span>
              </Box>
              <Button
                startIcon={<CreditCardIcon />}
                variant="contained"
                fullWidth
                color="primary"
                className="header_links_pay"
                onClick={onClose}
              >
                {t("PAYMENT.PAY_NOW")}
              </Button>
            </Box>
          </>
        }
      </Box>
    </Modal>
  );
};
