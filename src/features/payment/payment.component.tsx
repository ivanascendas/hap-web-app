import { Box, Button, FormHelperText, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";
import "./payment.component.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../shared/redux/slices/authSlice";
import { IntlTelInputComponent } from "../../shared/components/IntlTelInput.component";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { useForm } from "react-hook-form";
import { Iti } from "intl-tel-input";
import { useEffect, useRef, useState } from "react";
import { selectUserLoading } from "../../shared/redux/slices/loaderSlice";
import currency from "../../shared/utils/currency";
import { useNavigate } from "react-router-dom";
import { PaymentDto } from "../../shared/dtos/payments.dto";
import {
  selectInvoicesToPay,
  setInvoicesToPay,
} from "../../shared/redux/slices/paymentSlice";

export type PaymentProps = {};

export const PaymentComponent = ({}: PaymentProps): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const payments = useSelector(selectInvoicesToPay);
  const [iniTelReff, setIti] = useState<Iti>();
  const form = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<PaymentDto>({
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
      Phone: user?.phone,
      Zipcode: "NA",
    },
  });

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
        Phone: user?.phone,
        Zipcode: "NA",
      });
    }
  }, [user, isLoading]);

  const onSubmit = (data: PaymentDto) => {
    console.log({ data });

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

    navigate("/payment/pay");
  };

  const triggerSubmit = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Box className="payment-container">
      <div className="page_wrap_title">
        <h1 className="h_title aligncenter">
          {t("PAYMENT_INFO.ENTER_ADDITIONAL_INFO")}
        </h1>
        <p>{t("PAYMENT_INFO.DESCRIPTION_1")}</p>
        <p>{t("PAYMENT_INFO.DESCRIPTION_2")}</p>
        <p>{t("PAYMENT_INFO.DESCRIPTION_3")}</p>
      </div>
      <div className="personal_box">
        <form
          ref={form}
          onSubmit={handleSubmit(onSubmit)}
          className="payment_form"
        >
          <div className="payment_form_title">{t("PAYMENT_INFO.TITLE")}</div>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Box className="payment_form_row">
                <label
                  className=" required"
                  title={t("PAYMENT_INFO.INFO.NAME")}
                  htmlFor="account-name"
                  aria-label={t("PAYMENT_INFO.INFO.NAME")}
                >
                  {t("PAYMENT_INFO.INFO.NAME")}
                </label>

                <TextField
                  id="account-name"
                  {...register("Name", {
                    required: true,
                  })}
                />
              </Box>
            </Grid>
            <Grid size={{ lg: 8, xs: 12, md: 6 }}>
              <Box className="payment_form_row">
                <label
                  className="required"
                  title={t("PAYMENT_INFO.INFO.ADDRESS_1")}
                  htmlFor="address1"
                  aria-label={t("PAYMENT_INFO.INFO.ADDRESS_1")}
                >
                  {t("PAYMENT_INFO.INFO.ADDRESS_1")}
                </label>

                <TextField
                  id="address1"
                  {...register("Address1", {
                    required: true,
                  })}
                />
              </Box>
            </Grid>

            <Grid size={{ lg: 4, xs: 12, md: 6 }}>
              <Box className="payment_form_row">
                <label
                  className=" required"
                  title={t("PAYMENT_INFO.INFO.ADDRESS_2")}
                  htmlFor="address2"
                  aria-label={t("PAYMENT_INFO.INFO.ADDRESS_2")}
                >
                  {t("PAYMENT_INFO.INFO.ADDRESS_2")}
                </label>

                <TextField
                  id="address2"
                  {...register("Address2", {
                    required: true,
                  })}
                />
              </Box>
            </Grid>
            <Grid size={{ lg: 4, xs: 12, md: 6 }}>
              <Box className="payment_form_row">
                <label
                  className=" required"
                  title={t("PAYMENT_INFO.INFO.ADDRESS_3")}
                  htmlFor="address3"
                  aria-label={t("PAYMENT_INFO.INFO.ADDRESS_3")}
                >
                  {t("PAYMENT_INFO.INFO.ADDRESS_3")}
                </label>

                <TextField
                  id="address3"
                  {...register("Address3", {
                    required: true,
                  })}
                />
              </Box>
            </Grid>
            <Grid size={{ lg: 4, xs: 12, md: 6 }}>
              <Box className="payment_form_row">
                <label
                  className=" required"
                  title={t("PAYMENT_INFO.INFO.ADDRESS_4")}
                  htmlFor="address4"
                  aria-label={t("PAYMENT_INFO.INFO.ADDRESS_4")}
                >
                  {t("PAYMENT_INFO.INFO.ADDRESS_4")}
                </label>

                <TextField
                  id="address4"
                  {...register("County", {
                    required: true,
                  })}
                />
              </Box>
            </Grid>

            <Grid container size={{ lg: 4, xs: 12, md: 6 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="payment_form_row">
                  <label
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.COUNTRY")}
                    htmlFor="country"
                    aria-label={t("PAYMENT_INFO.INFO.COUNTRY")}
                  >
                    {t("PAYMENT_INFO.INFO.COUNTRY")}
                  </label>

                  <TextField
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
                    className=" required"
                    title={t("PAYMENT_INFO.INFO.EIRCODE")}
                    htmlFor="zipcode"
                    aria-label={t("PAYMENT_INFO.INFO.EIRCODE")}
                  >
                    {t("PAYMENT_INFO.INFO.EIRCODE")}
                  </label>

                  <TextField
                    id="zipcode"
                    className="country-data"
                    {...register("Zipcode", {
                      required: true,
                    })}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid size={{ lg: 4, xs: 12, md: 6 }}>
              <Box className="payment_form_row">
                <label
                  className=" required"
                  title={t("PAYMENT_INFO.INFO.EMAIL")}
                  htmlFor="account-email"
                  aria-label={t("PAYMENT_INFO.INFO.EMAIL")}
                >
                  {t("PAYMENT_INFO.INFO.EMAIL")}
                </label>

                <TextField
                  id="account-email"
                  {...register("Email", {
                    required: true,
                  })}
                />
              </Box>
            </Grid>
            <Grid size={{ lg: 4, xs: 12, md: 6 }}>
              <Box className="payment_form_row">
                <label
                  className=" required"
                  title={t("PAYMENT_INFO.INFO.PHONE")}
                  htmlFor="account-name"
                  aria-label={t("PAYMENT_INFO.INFO.PHONE")}
                >
                  {t("PAYMENT_INFO.INFO.PHONE")}
                </label>

                <Box>
                  <IntlTelInputComponent
                    id="phone-input"
                    className={`payment_form__phone-input`}
                    {...register("Phone", {
                      required: true,
                      validate: (value) => {
                        if (iniTelReff?.isValidNumber()) {
                          return true;
                        } else {
                          return t("ERRORS.INVALID_PHONE");
                        }
                      },
                    })}
                    error={!!errors.Phone}
                    aria-invalid={!!errors.Phone}
                    options={{
                      initialCountry: "ie",
                      separateDialCode: true,
                      formatOnDisplay: true,
                      formatAsYouType: true,
                    }}
                    getIti={setIti}
                    // onChange={onChangePhoneHandler}
                  />
                  <FormHelperText error={!!errors.Phone}>
                    {!!errors.Phone && t("ERRORS.INVALID_PHONE")}
                  </FormHelperText>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0.625rem 0",
        }}
      >
        <Button
          sx={{ display: { xs: "none !important", md: "flex !important" } }}
          onClick={() => navigate("/statements/rates")}
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
    </Box>
  );
};
