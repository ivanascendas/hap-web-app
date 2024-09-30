import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import {
  UserConfirmDataModel,
  UserDataDto,
} from "../../../../shared/dtos/user.dto";
import { selectUser, setUser } from "../../../../shared/redux/slices/authSlice";
import Grid from "@mui/material/Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { OtpInputComponent } from "../../../../shared/components/otpInput.component";
import {
  useDobConfirmationMutation,
  useEmailOptRequestMutation,
  useEmailOtpConfirmationMutation,
  useSmsOptRequestMutation,
  useSmsOtpConfirmationMutation,
} from "../../../../shared/services/Verification.service";
import { use } from "i18next";
import { Dayjs } from "dayjs";
import { getErrorMessage } from "../../../../shared/utils/getErrorMessage";
import { usePasswordValidator } from "../../../../shared/utils/password.validator";

export const RegConfirmFormComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const [dob, setDOB] = React.useState<Dayjs | null>(null);
  const [resendSMS, resendSMSResult] = useSmsOptRequestMutation();
  const [checkSMSCode, checkSMSResult] = useSmsOtpConfirmationMutation();
  const [resendEmail, resendEmailResult] = useEmailOptRequestMutation();
  const [checkEmailCode, checkEmailResult] = useEmailOtpConfirmationMutation();
  const [checkDOB, checkDOBResult] = useDobConfirmationMutation();

  const { email, phone, accountNumber } = useSelector(selectUser);
  const [isPasswordValid, passwordError] = usePasswordValidator({
    minLength: parseInt(process.env.REACT_APP_PASSWORD_MIN_LENGTH || "8"),
    hasNumber: process.env.REACT_APP_PASSWORD_USE_NUMBERS === "true" || false,
    hasSpecialChar:
      process.env.REACT_APP_PASSWORD_USE__SPECIAL_CHARACTER === "true" || false,
    hasUpperCase:
      process.env.REACT_APP_PASSWORD_USE_UPPERCASE === "true" || false,
    hasLowerCase:
      process.env.REACT_APP_PASSWORD_USE_LOWERCASE === "true" || false,
    charRepeating:
      (process.env.REACT_APP_PASSWORD_MAX_REPEATING &&
        process.env.REACT_APP_PASSWORD_MAX_REPEATING !== "false" &&
        parseInt(process.env.REACT_APP_PASSWORD_MAX_REPEATING)) ||
      undefined,
  });
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    getValues,
    formState,
  } = useForm<UserConfirmDataModel>({
    mode: "all",
  });

  const onSubmit = ({
    emailConfirmed,
    dobIsVerified,
    phoneNumberConfirmed,
    password,
  }: UserConfirmDataModel) => {
    dispatch(setUser({ emailConfirmed, dobIsVerified, phoneNumberConfirmed }));
  };

  useEffect(() => {
    resendEmail({
      UserId: accountNumber?.toString() || "",
      EmailId: email?.toString() || "",
    });

    resendSMS({
      UserId: accountNumber?.toString() || "",
      PhoneNumber: phone?.toString() || "",
    });
  }, []);

  useEffect(() => {
    if (checkSMSResult.isSuccess) {
      setValue("phoneNumberConfirmed", true);
    }
    if (checkEmailResult.isSuccess) {
      setValue("emailConfirmed", true);
    }

    if (checkDOBResult.isSuccess) {
      setValue("dobIsVerified", true);
    }
  }, [
    checkSMSResult.isSuccess,
    checkEmailResult.isSuccess,
    checkDOBResult.isSuccess,
  ]);

  if (formState.isSubmitted && email && phone) {
    console.log({ isSubmitted: formState.isSubmitted, email, phone });
    return (
      <Navigate to="/registration/step3" state={{ from: location }} replace />
    );
  }

  return (
    <div role="form">
      <div className="registration__subtitle">
        {t("SIGN_UP.DESCRIPTION_STEP_3")}
      </div>
      <form className="registration__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MFA.ENTER_EMAIL_OTP")}
            htmlFor="registration-acc-email"
            aria-label={t("MFA.ENTER_EMAIL_OTP")}
          >
            {t("MFA.ENTER_EMAIL_OTP")}
          </label>

          <OtpInputComponent
            isChecked={checkEmailResult.isSuccess}
            btnLabel="Check"
            resendLabel="Resend OTP"
            onResend={() =>
              resendEmail({
                UserId: accountNumber?.toString() || "",
                EmailId: email?.toString() || "",
              })
            }
            onSubmit={checkEmailCode}
          />
        </div>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MFA.ENTER_PHONE_OTP")}
            htmlFor="registration-acc-number"
            aria-label={t("MFA.ENTER_PHONE_OTP")}
          >
            {t("MFA.ENTER_PHONE_OTP")}
          </label>
          <OtpInputComponent
            isChecked={checkSMSResult.isSuccess}
            btnLabel="Check"
            resendLabel="Resend OTP"
            onResend={() =>
              resendSMS({
                UserId: accountNumber?.toString() || "",
                PhoneNumber: phone?.toString() || "",
              })
            }
            onSubmit={checkSMSCode}
          />
        </div>

        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_BIRTH_DATES_TOOLTIP")}
            htmlFor="phone-input"
            aria-label={t("LABELS.ENTER_BIRTH_DATE")}
          >
            {t("LABELS.ENTER_BIRTH_DATE")}
          </label>
          <Grid container spacing={0} className="otp-input">
            <Grid size={8}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker format="DD/MM/YYYY" value={dob} onChange={setDOB} />
              </LocalizationProvider>
            </Grid>
            <Grid size={4}>
              <button
                className="otp-input__button"
                onClick={() => dob && checkDOB(dob.toISOString())}
              >
                Check
              </button>
            </Grid>
            <Grid size={8}></Grid>
          </Grid>
        </div>
        <div className="h5">{t("LABELS.PASSWORDS_INFO")}</div>
        <div className="registration__input-container">
          <Grid container spacing={2}>
            <Grid size={6}>
              <label
                htmlFor="password-label"
                className="registration__label label-question required"
                title={t("MESSAGES.CUSTOMER_PASSWORD_TOOLTIP")}
              >
                {t("LABELS.PASSWORD")}
              </label>
              <TextField
                id="password-label"
                {...register("password", {
                  required: true,
                  validate: (value) => isPasswordValid(value),
                })}
                error={!!errors.password}
                helperText={getErrorMessage(
                  (errors.password?.type !== "validate" &&
                    errors.password?.type) ||
                    passwordError,
                  t,
                )}
                slotProps={{
                  htmlInput: {
                    "aria-invalid": !!errors.password,
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
              <label
                htmlFor="confirm-password-label"
                className="registration__label label-question required"
                title={t("MESSAGES.CUSTOMER_PASSWORD_TOOLTIP")}
              >
                {t("LABELS.CONFIRM_PASSWORD")}
              </label>

              <TextField
                id="confirm-password-label"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) => value === getValues("password"),
                })}
                error={!!errors.confirmPassword}
                helperText={getErrorMessage(
                  (errors.confirmPassword?.type !== "validate" &&
                    errors.confirmPassword?.type) ||
                    (errors.confirmPassword && "ERRORS.PASSWORD_VERIFY"),
                )}
                slotProps={{
                  htmlInput: {
                    "aria-invalid": !!errors.confirmPassword,
                  },
                }}
              />
            </Grid>
          </Grid>
        </div>
        <div className="registration__input-container">
          <FormControlLabel
            control={
              <Checkbox
                {...register("isTermsAccepted", {
                  required: true,
                })}
                inputProps={{
                  "aria-invalid": !!errors.isTermsAccepted,
                }}
              />
            }
            label={
              <div
                dangerouslySetInnerHTML={{
                  __html: t("SIGN_UP.AGREE", {
                    terms: `<a href="" >${t("LABELS.TERMS_AND_CONDITION")}</a>`,
                  }),
                }}
              />
            }
          />
        </div>
        <button
          type="submit"
          className="button-primary registration__button"
          role="button"
          disabled={
            !checkSMSResult.isSuccess ||
            !checkEmailResult.isSuccess ||
            !checkDOBResult.isSuccess ||
            !formState.isDirty ||
            !formState.isValid ||
            formState.isSubmitted
          }
        >
          {t("SIGN_UP.BUTTONS.NEXT")}
        </button>
        <Link
          className="button-secondary back-btn registration__back"
          to="/registration/step1"
        >
          {t("BUTTONS.BACK")}
        </Link>
      </form>
    </div>
  );
};
