import { Box, Button, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  DEFAUT_HPP_TEST_URL,
  RealexHpp,
} from "../../shared/plugins/realex-pay.plugin";
import { useSelector } from "react-redux";
import { selectInvoicesToPay } from "../../shared/redux/slices/paymentSlice";
import {
  useConfirmPaymentMutation,
  usePayInvoicesMutation,
} from "../../shared/services/Payment.service";
import "./payment.component.scss";

import WestIcon from "@mui/icons-material/West";
import {
  PaymentResponseDto,
  PaymentResultResponseDto,
} from "../../shared/dtos/payments.dto";

import paymentAccepted from "../../assets/img/payment_accepted.svg";
import paymentError from "../../assets/img/payment_error.svg";
import currency from "../../shared/utils/currency";

export const PayComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const [showPaymentResponse, setShowPaymentResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const payments = useSelector(selectInvoicesToPay);
  const [payInvoices] = usePayInvoicesMutation();
  const [confirmPayment] = useConfirmPaymentMutation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLDivElement>(null);

  const closeIframe = (): void => {
    RealexHpp.embedded.close();
    const iFrame = document.getElementById("payment_iframe");
    if (iFrame) {
      iFrame.parentNode?.removeChild(iFrame);
    }
  };
  const createIframe = (): void => {
    const iframe = document.createElement("iframe");
    iframe.frameBorder = "no";
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.id = "payment_iframe";
    iframe.style.display = "none";
    iframe.style.top = "2.5rem";
    iframeRef.current?.appendChild(iframe);
  };

  const decode = (str: string) =>
    decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

  const onReceiveMessage = async (data: string) => {
    if (typeof data === "string" && data.length > 0) {
      try {
        const parsedData = JSON.parse(data);

        if (!parsedData.iframe) {
          let paymentResponse: any = {};
          Object.keys(parsedData).forEach((key) => {
            paymentResponse[key] = decode(parsedData[key]);
          });

          let paymentResponseDto: PaymentResultResponseDto = {
            Timestamp: paymentResponse["TIMESTAMP"],
            OrderId: paymentResponse["ORDER_ID"],
            ResultCode: paymentResponse["RESULT"],
            Message: paymentResponse["MESSAGE"],
            PasRef: paymentResponse["PASREF"],
            AuthCode: paymentResponse["AUTHCODE"],
            Sha1Hash: paymentResponse["SHA1HASH"],
            BodyContent: paymentResponse,
          };

          await confirmPayment(paymentResponseDto);
          setShowPaymentResponse(paymentResponse["RESULT"]);
          closeIframe();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        closeIframe();
        console.log("Error parsing JSON:", { error, data });
      }
    }
  };

  const init = (): void => {
    payInvoices(payments)
      .then((r) => r.data)
      .then((data) => {
        if (data) {
          const token = {
            TIMESTAMP: data.timestamp,
            HPP_CUSTOMER_EMAIL: data.email,
            HPP_CUSTOMER_PHONENUMBER_MOBILE: data.phone,
            HPP_BILLING_STREET1: data.address1,
            HPP_BILLING_STREET2: data.address2,
            HPP_BILLING_STREET3: data.address3,
            HPP_BILLING_CITY: data.city,
            HPP_BILLING_POSTALCODE: data.zipcode,
            HPP_BILLING_COUNTRY: 372,
            CUST_NUM: data.customerNumber || [],
            MERCHANT_ID: data.merchantId,
            ACCOUNT: data.account,
            ORDER_ID: data.orderId,
            AMOUNT: data.amount,
            CURRENCY: data.currency,
            AUTO_SETTLE_FLAG: data.autoSettleFlag,
            HPP_LANG: data.hppLang,
            CARD_PAYMENT_BUTTON: "Confirm Payment",
            SHA1HASH: data.sha1Hash,
          };

          if (token) {
            createIframe();
            RealexHpp.setHppUrl(DEFAUT_HPP_TEST_URL);
            RealexHpp.embedded.init(
              null,
              "payment_iframe",
              null,
              token,
              onReceiveMessage,
            );
          }
        }
      });
  };

  useEffect(() => {
    init();
    return () => {
      closeIframe();
    };
  }, []);

  return (
    <Box
      sx={{ width: "100%", height: "calc(100% - 2rem)", padding: "1rem" }}
      className="payment-container"
    >
      <Box className="payment_card" id="wrap_iframe" ref={iframeRef}>
        {isLoading && (
          <Skeleton
            variant="rectangular"
            height="100%"
            width="100%"
            sx={{ marginBottom: "3rem" }}
          />
        )}
        {showPaymentResponse && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={
                showPaymentResponse === "00" ? paymentAccepted : paymentError
              }
              alt="payment-response"
            />
            <Typography variant="h4">
              {t(
                showPaymentResponse === "00"
                  ? "MESSAGES.PAYMENT_ACCEPTED"
                  : "MESSAGES.SOMETHING_ERROR",
              )}
            </Typography>
            <br />
            <Typography variant="body2">
              {t(
                showPaymentResponse === "00"
                  ? "MESSAGES.PAYMENT_ACCEPTED_TITLE"
                  : "MESSAGES.PAYMENT_DECLINED_TITLE",
              )}
            </Typography>
            <br />
            <Typography variant="h3">
              {" "}
              {currency.format(
                payments.reduce((acc, payment) => acc + payment.AmountToPay, 0),
              )}{" "}
              ({payments.length})
            </Typography>
          </Box>
        )}
      </Box>
      <Box className="payment_button">
        <Button
          startIcon={<WestIcon />}
          onClick={() => navigate("/statements/rates")}
        >
          {t("PAYMENT.BACK_TO_STAT")}
        </Button>
      </Box>
    </Box>
  );
};
