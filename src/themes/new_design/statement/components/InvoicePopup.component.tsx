import React, { useContext } from "react";
import "./InvoicePopup.component.scss";
import { Modal, Box, Tooltip, Button, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { t } from "i18next";
import { InvoiceInputRequest } from "@shared/dtos/invoice.dtos";
import { useGetInvoiceDetailsQuery } from "@shared/services/Statements.service";
import currency from "@shared/utils/currency";
import DownloadForOfflineIcon from "@mui/icons-material/Download";

export type InvoicePopupProps = {
  open: boolean;
  dto: InvoiceInputRequest;
  onClose: () => void;
};

export const InvoicePopupComponent = ({
  open,
  onClose,
  dto,
}: InvoicePopupProps): JSX.Element => {
  const { isFetching } = useGetInvoiceDetailsQuery(dto);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="invoiuce modal"
      aria-describedby="invoiuce modal description"
    >
      <Box className="popup invoice_popup">
        {isFetching ? (
          <>
            <Box className="invoice_popup_header">
              <strong className="invoice_popup_header_title">
                Payment Invoice
              </strong>
              <Skeleton
                role="progressbar"
                aria-label=""
                width={170}
                height={24}
              />
              <Tooltip title={t("BUTTONS.CLOSE")}>
                <CloseIcon onClick={onClose} />
              </Tooltip>
            </Box>
            <Box className="invoice_popup_content">
              <Box className="invoice_popup_content_block">
                <Box className="invoice_popup_content_row">
                  <Box className="invoice_popup_content_row_label">
                    {t("INVOICE_DETAILS.ISSUED_ON")}
                  </Box>
                  <Box>
                    <Skeleton role="progressbar" width={170} height={24} />
                  </Box>
                </Box>
                <Box className="invoice_popup_content_row">
                  <Box className="invoice_popup_content_row_label">
                    {t("INVOICE_DETAILS.PROPERTY")}
                  </Box>
                  <Box>
                    <Skeleton role="progressbar" width={170} height={24} />
                  </Box>
                </Box>
              </Box>
              <Box className="invoice_popup_content_block">
                <Box className="invoice_popup_content_row">
                  <Box className="invoice_popup_content_row_label">
                    {t("INVOICE_DETAILS.DUE_DATE")}
                  </Box>
                  <Box>
                    <Skeleton role="progressbar" width={170} height={24} />
                  </Box>
                </Box>
                <Box className="invoice_popup_content_row">
                  <Box className="invoice_popup_content_row_label">
                    {t("INVOICE_DETAILS.INVOICED")}
                  </Box>
                  <Box>
                    <Skeleton role="progressbar" width={170} height={24} />
                  </Box>
                </Box>
                <Box className="invoice_popup_content_row">
                  <Box className="invoice_popup_content_row_label">
                    {t("INVOICE_DETAILS.PAID")}
                  </Box>
                  <Box>
                    <Skeleton role="progressbar" width={170} height={24} />
                  </Box>
                </Box>
                <Box className="invoice_popup_content_row">
                  <Box>{t("INVOICE_DETAILS.BALANCE")}</Box>
                  <Box>
                    <Skeleton role="progressbar" width={170} height={24} />
                  </Box>
                </Box>
                <Box
                  className="invoice_popup_content_row"
                  sx={{ flexDirection: "column" }}
                >
                  <Button
                    disabled={true}
                    variant="contained"
                    fullWidth
                    color="primary"
                    className="download"
                    onClick={onClose}
                  >
                    {t("INVOICE_DETAILS.DOWNLOAD")}
                  </Button>

                  <Button
                    disabled={true}
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={onClose}
                  >
                    {t("MAIN.PAY")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box className="invoice_popup_header">
              <strong className="invoice_popup_header_title">
                Payment Invoice
              </strong>
              <Tooltip title={t("BUTTONS.CLOSE")}>
                <CloseIcon onClick={onClose} />
              </Tooltip>
            </Box>
            <Box className="invoice_popup_content">
              <Box className="invoice_popup_content_block">
                <Box className="invoice_popup_content_row">
                  <Box className="invoice_popup_content_row_label">
                    {t("INVOICE_DETAILS.PAID")}
                  </Box>
                  <Box className="invoice_popup_content_row_value">
                    {currency.format(557.0)}
                  </Box>
                </Box>
                <Box className="invoice_popup_content_row">
                  <Box className="invoice_popup_content_row_label">
                    {t("INVOICE_DETAILS.BALANCE")}
                  </Box>
                  <Box className="invoice_popup_content_row_value negative">
                    {currency.format(140)}
                  </Box>
                </Box>
              </Box>
              <Box className="invoice_popup_content_row">
                <Box className="invoice_popup_content_row_label">
                  {t("PAYMENT_DETAILS.DATE")}
                </Box>
                <Box
                  className="invoice_popup_content_row_value"
                  sx={{ fontWeight: "500 !important" }}
                >
                  {moment(new Date()).format(" DD.MM.YYYY [a]t HH:mm")}
                </Box>
              </Box>
              <Box className="invoice_popup_content_row">
                <Box className="invoice_popup_content_row_label">
                  Transaction Type:
                </Box>
                <Box
                  className="invoice_popup_content_row_value"
                  sx={{ fontWeight: "500 !important" }}
                >
                  Payment Invoice
                </Box>
              </Box>
              <Box className="invoice_popup_content_row">
                <Box className="invoice_popup_content_row_label">
                  {t("PAYMENT_DETAILS.REFERENCE")}
                </Box>
                <Box
                  className="invoice_popup_content_row_value"
                  sx={{ fontWeight: "500 !important" }}
                >
                  -
                </Box>
              </Box>
            </Box>
            <Box className="invoice_popup_content_footer">
              <Button
                startIcon={<DownloadForOfflineIcon />}
                variant="contained"
                fullWidth
                color="primary"
                className="btn-secondary"
                onClick={onClose}
              >
                {t("INVOICE_DETAILS.DOWNLOAD")}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};
