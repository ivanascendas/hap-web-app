import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Modal,
  Typography,
} from "@mui/material";

import { useEffect, useRef } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import "./payment.component.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectBalance, selectUser } from "@shared/redux/slices/authSlice";
import { IntlTelInputComponent } from "@shared/components/IntlTelInput.component";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { useForm } from "react-hook-form";
import { selectUserLoading } from "@shared/redux/slices/loaderSlice";
import currency from "@shared/utils/currency";
import { useNavigate } from "react-router-dom";
import { PaymentDto } from "@shared/dtos/payments.dto";
import {
  selectInvoicesToPay,
  setInvoicesToPay,
} from "@shared/redux/slices/paymentSlice";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import { SummaryBoxComponent } from "@components/common/components/summary-box.component";
import { TextInput } from "@components/common/components/TextInput.component";
import { usePhoneInput } from "@shared/hooks/usePhoneInput";
import { PayComponent } from "./pay.component";
import {
  useLazyGetPaymentInfoQuery,
  useSetPaymentInfoMutation,
} from "@shared/services/Payment.service";
import { getValue } from "@testing-library/user-event/dist/utils";
type PaymentModel = PaymentDto & {
  shouldSaveInfo?: boolean;
};
export const PaymentComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const payments = useSelector(selectInvoicesToPay);
  const balance = useSelector(selectBalance);
  const [open, setOpen] = React.useState<boolean>(false);
  const form = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getPaymentInfo, { isLoading: isPaymentInfoLoading, isUninitialized }] =
    useLazyGetPaymentInfoQuery();
  const [setPaymentInfo] = useSetPaymentInfoMutation();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<PaymentModel>({
    mode: "all",
    defaultValues: {
      VoucherNo: "",
      SequenceNo: "",
      AmountToPay: 0,
      incDept: "",
      Name: user?.customerName,
      Number: user?.customerNo,
      Address1: user?.address?.slice(0, 40).trim(),
      Address2: user?.address?.slice(40, 80),
      Address3: "",
      County: "",
      phoneCode: user?.countryCode?.toString() || "",
      City: "City",
      Country: "Ireland",
      Email: user?.email,
      Phone: user ? `+${user?.phone}` : "",
      Zipcode: "NA",
      shouldSaveInfo: false, // Default value for the checkbox
    },
  });

  const { handlePhoneChange, handleItiInit, validatePhone, setPhoneNumber } =
    usePhoneInput(setValue);

  useEffect(() => {
    if (!isLoading && user?.defaultMFA) {
      reset({
        VoucherNo: "",
        SequenceNo: "",
        AmountToPay: 0,
        incDept: "",
        Name: user?.customerName,
        Number: user?.customerNo,
        Address1: user?.address?.slice(0, 40).trim(),
        Address2: user?.address?.slice(40, 80),
        Address3: user?.town || "",
        County: user?.county || "",
        phoneCode: user?.countryCode?.toString() || "",
        City: "City",
        Country: "Ireland",
        Email: user?.email,
        Phone: `+${user?.phone}`,
        Zipcode: "NA",
      });
      if (user.phone) {
        setPhoneNumber(`+${user.phone.replace(/^\+/, "")}`);
      }
    }
  }, [user, isLoading, reset, setPhoneNumber]);

  /**
   * Handles form submission for payment data.
   *
   * Extracts billing/contact information from the form data, updates all payment
   * records with this information via Redux dispatch, and navigates to the payment
   * processing page.
   *
   * @param data - The payment form data containing billing and contact information
   * @param data.Name - Customer name
   * @param data.Number - Contact number or reference number
   * @param data.Address1 - Primary address line
   * @param data.Address2 - Secondary address line (optional)
   * @param data.Address3 - Tertiary address line (optional)
   * @param data.County - County information
   * @param data.phoneCode - Phone country code
   * @param data.City - City name
   * @param data.Country - Country name
   * @param data.Email - Email address
   * @param data.Phone - Phone number
   * @param data.Zipcode - Postal/ZIP code
   */
  const onSubmit = (payment: PaymentModel) => {
    const { shouldSaveInfo, ...data } = payment;
    console.log("Payment data submitted:", data);
    if (shouldSaveInfo) {
      setPaymentInfo({
        ...data,
      });
    }
    const {
      Name,
      Number,
      Address1,
      Address2,
      Address3,
      County,
      phoneCode,
      City,
      Country,
      Email,
      Phone,
      Zipcode,
    } = data;
    dispatch(
      setInvoicesToPay(
        payments.map((payment) => ({
          ...payment,
          Name,
          Number,
          Address1,
          Address2,
          Address3,
          County,
          phoneCode,
          City,
          Country,
          Email,
          Phone,
          Zipcode,
        })),
      ),
    );
    const usePopup = false; //true;
    if (usePopup) {
      setOpen(true);
    } else {
      navigate("/payment/pay");
    }
  };

  useEffect(() => {
    if (isPaymentInfoLoading || !isUninitialized) {
      return;
    }
    getPaymentInfo()
      .then((res) => res.data)
      .then((info) => {
        if (info) {
          reset({
            VoucherNo: info.VoucherNo || "0",
            SequenceNo: info.SequenceNo || "0",
            AmountToPay: info.AmountToPay || 0,
            incDept: info.incDept || "",
            Name: info.Name || user?.customerName,
            Number: info.Number || user?.customerNo,
            Address1: info.Address1 || user?.address?.slice(0, 40).trim(),
            Address2: info.Address2 || user?.address?.slice(40, 80),
            Address3: info.Address3 || user?.town || "",
            County: info.County || user?.county || "",
            phoneCode: info.phoneCode || user?.countryCode?.toString() || "",
            City: info.City || "City",
            Country: info.Country || "Ireland",
            Email: info.Email || user?.email,
            Phone: info.Phone || `+${user?.phone}`,
            Zipcode: info.Zipcode || "NA",
          });
        }
      });
  }, [isPaymentInfoLoading, getPaymentInfo, reset]);

  /**
   * Triggers the form submission by calling the handleSubmit function with the onSubmit callback.
   * This function programmatically submits the form, bypassing the need for a submit button click.
   */
  const triggerSubmit = () => {
    handleSubmit(onSubmit)()
      .then(() => {
        console.log("Form submitted successfully", errors);
      })
      .catch((error) => {
        console.error("Form submission error:", error);
      });
  };

  return (
    <Box className="payment-container">
      <h1 className="h_title aligncenter">
        {t("PAYMENT_INFO.ENTER_ADDITIONAL_INFO")}
      </h1>
      <Box sx={{}} className="payment_form_container">
        <Box className="personal_box" sx={{ flex: 2 }}>
          <form
            ref={form}
            onSubmit={handleSubmit(onSubmit)}
            className="payment_form"
          >
            <div className="payment_form_title">{t("PAYMENT_INFO.TITLE")}</div>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.NAME")}
                    htmlFor="account-name"
                    aria-label={t("PAYMENT_INFO.INFO.NAME")}
                  >
                    {t("PAYMENT_INFO.INFO.NAME")}
                  </label>

                  <TextInput
                    id="account-name"
                    {...register("Name", {
                      required: true,
                    })}
                  />
                </Box>
              </Grid>
              <Grid sx={{ display: "none" }} size={12}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.COUNTRY")}
                    htmlFor="country"
                    aria-label={t("PAYMENT_INFO.INFO.COUNTRY")}
                  >
                    {t("PAYMENT_INFO.INFO.COUNTRY")}
                  </label>

                  <TextInput
                    id="country"
                    className="country-data"
                    {...register("Country")}
                    disabled
                    slotProps={{
                      htmlInput: {
                        readOnly: true,
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="payment_form_row">
                  <label
                    className="required"
                    title={t("PAYMENT_INFO.INFO.ADDRESS_1")}
                    htmlFor="address1"
                    aria-label={t("PAYMENT_INFO.INFO.ADDRESS_1")}
                  >
                    {t("PAYMENT_INFO.INFO.ADDRESS_1")}
                  </label>

                  <TextInput
                    id="address1"
                    {...register("Address1", {
                      required: true,
                    })}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.ADDRESS_2")}
                    htmlFor="address2"
                    aria-label={t("PAYMENT_INFO.INFO.ADDRESS_2")}
                  >
                    {t("PAYMENT_INFO.INFO.ADDRESS_2")}
                  </label>

                  <TextInput
                    id="address2"
                    {...register("Address2", {
                      required: true,
                    })}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.ADDRESS_3")}
                    htmlFor="address3"
                    aria-label={t("PAYMENT_INFO.INFO.ADDRESS_3")}
                  >
                    {t("PAYMENT_INFO.INFO.ADDRESS_3")}
                  </label>

                  <TextInput
                    id="address3"
                    {...register("Address3", {
                      required: true,
                    })}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.ADDRESS_4")}
                    htmlFor="address4"
                    aria-label={t("PAYMENT_INFO.INFO.ADDRESS_4")}
                  >
                    {t("PAYMENT_INFO.INFO.ADDRESS_4")}
                  </label>

                  <TextInput
                    id="address4"
                    {...register("County", {
                      required: true,
                    })}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.PHONE")}
                    htmlFor="phone-input"
                    aria-label={t("PAYMENT_INFO.INFO.PHONE")}
                  >
                    {t("PAYMENT_INFO.INFO.PHONE")}
                  </label>

                  <TextInput
                    id="phone-input"
                    error={!!errors.Phone}
                    helperText={getErrorMessage(errors.Phone?.message)}
                    slotProps={{
                      htmlInput: {
                        "aria-invalid": !!errors.Phone,
                      },
                      input: {
                        inputComponent: IntlTelInputComponent,
                        inputProps: {
                          options: {
                            initialCountry: "ie",
                            separateDialCode: true,
                            formatOnDisplay: true,
                            formatAsYouType: true,
                          },
                          getIti: handleItiInit,
                          onChange: handlePhoneChange,
                        },
                      },
                    }}
                    {...register("Phone", {
                      required: true,
                      validate: validatePhone,
                    })}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.EIRCODE")}
                    htmlFor="zipcode"
                    aria-label={t("PAYMENT_INFO.INFO.EIRCODE")}
                  >
                    {t("PAYMENT_INFO.INFO.EIRCODE")}
                  </label>

                  <TextInput
                    id="zipcode"
                    className="country-data"
                    {...register("Zipcode", {
                      required: true,
                    })}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Box className="payment_form_row">
                <label
                  className=" required"
                  title={t("PAYMENT_INFO.INFO.EMAIL")}
                  htmlFor="account-email"
                  aria-label={t("PAYMENT_INFO.INFO.EMAIL")}
                >
                  {t("PAYMENT_INFO.INFO.EMAIL")}
                </label>

                <TextInput
                  id="account-email"
                  {...register("Email", {
                    required: true,
                  })}
                />
              </Box>
              <Grid size={12}>
                <Box className="payment_form_row" sx={{ marginTop: "1rem" }}>
                  <FormControlLabel
                    control={<Checkbox {...register("shouldSaveInfo")} />}
                    label={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: t("PAYMENT_INFO.SAVE_INFO"),
                        }}
                      />
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Box className="personal_box info">
          <Typography component="strong">
            {t("PAYMENT_INFO.DESCRIPTION_1")}
          </Typography>
          <Typography>{t("PAYMENT_INFO.DESCRIPTION_2")}</Typography>
          <Typography>{t("PAYMENT_INFO.DESCRIPTION_3")}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "none",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0.625rem 0",
        }}
      >
        <Button
          sx={{ display: { xs: "none !important", md: "flex !important" } }}
          onClick={() => navigate("/statements")}
          startIcon={<WestIcon />}
        >
          {t("BUTTONS.BACK_TO_STATEMENTS")}
        </Button>
        <Box className="payment_form_controls">
          <Box className="payment_form_controls_total">
            <span> {t("LABELS.TOTAL")}: </span>
            <span>
              {" "}
              {currency.format(
                payments.reduce((acc, payment) => acc + payment.AmountToPay, 0),
              )}
            </span>
          </Box>
          <Button
            sx={{ width: "33%", padding: "0.9375rem" }}
            disabled={!isValid}
            className="btn btn-primary"
            variant="contained"
            endIcon={<EastIcon />}
            onClick={triggerSubmit}
          >
            {t("PAYMENT.PAY_NOW")}
          </Button>
        </Box>
      </Box>
      <SummaryBoxComponent
        variant="short"
        value={payments.reduce((acc, payment) => acc + payment.AmountToPay, 0)}
        currentBalance={balance?.currentBalance}
        onClick={triggerSubmit}
      />
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <>
            <PayComponent onClose={() => setOpen(false)} />
          </>
        </Modal>
      )}
    </Box>
  );
};
