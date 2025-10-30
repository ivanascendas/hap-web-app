import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { UserConfirmDataModel } from "@shared/dtos/user.dto";

import { selectUser, setUser } from "@shared/redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { OtpInputComponent } from "@components/common/components/otpInput.component";
import {
  useDobConfirmationMutation,
  useEmailOptRequestMutation,
  useEmailOtpConfirmationMutation,
  useSmsOptRequestMutation,
  useSmsOtpConfirmationMutation,
} from "@shared/services/Verification.service";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import { usePasswordValidator } from "@shared/utils/password.validator";

import { TextInput } from "../../../common/components/TextInput.component";
import { PasswordCheckList } from "@components/common/components/PasswordCheckList.component";
import { Dayjs } from "dayjs";
import { useConfig } from "@shared/providers/Configuration.provider";

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

  const { email, phone, accountNumber } = useSelector(selectUser) || {};
  const { config } = useConfig();

  const passwordConfig = {
    minLength: config?.passwordMinLength || 8,
    hasNumber: config?.passwordUseNumbers || false,
    hasSpecialChar: config?.passwordUseSpecialCharacter || false,
    hasUpperCase: config?.passwordUseUppercase || false,
    hasLowerCase: config?.passwordUseLowercase || false,
    charRepeating: config?.passwordMaxRepeating || undefined,
  };
  const [isPasswordValid, passwordError] = usePasswordValidator(passwordConfig);
  const {
    watch,
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
    dispatch(
      setUser({
        emailConfirmed,
        dobIsVerified,
        phoneNumberConfirmed,
        password,
      }),
    );
  };

  useEffect(() => {
    if (accountNumber && email) {
      resendEmail({
        UserId: accountNumber.toString() || "",
        EmailId: email.toString() || "",
      });
    }
    if (accountNumber && phone) {
      resendSMS({
        UserId: accountNumber?.toString() || "",
        PhoneNumber: phone?.toString() || "",
      });
    }
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
  const passwordValue = watch("password");
  console.log("reload");
  return (
    <Box role="form" sx={{ padding: { sx: "0", md: "0 0.9375rem" } }}>
      <div className="registration__subtitle">
        {t("SIGN_UP.DESCRIPTION_STEP_3")}
      </div>
      <div className="registration__input-container">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <label
              className="registration__label  required"
              title={t("MFA.ENTER_EMAIL_OTP")}
              htmlFor="registration-acc-email-otp"
              aria-label={t("MFA.ENTER_EMAIL_OTP")}
            >
              {t("MFA.ENTER_EMAIL_OTP")}
            </label>

            <OtpInputComponent
              isChecked={checkEmailResult.isSuccess}
              input={{
                id: "registration-acc-email-otp",
              }}
              isSubmitting={
                resendEmailResult.isLoading || checkEmailResult.isLoading
              }
              btnLabel={t("BUTTONS.CHECK")}
              resendLabel={t("MFA.VERIFICATION_INPUT.RESEND_OTP")}
              onResend={() => {
                console.log("resend email");
                if (accountNumber && email) {
                  resendEmail({
                    UserId: accountNumber.toString() || "",
                    EmailId: email.toString() || "",
                  });
                }
              }}
              onSubmit={(otp) =>
                checkEmailCode({
                  otp,
                  accountNumber: accountNumber?.toString() || "",
                })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <label
              className="registration__label required"
              title={t("MFA.ENTER_PHONE_OTP")}
              htmlFor="registration-acc-number-otp"
              aria-label={t("MFA.ENTER_PHONE_OTP")}
            >
              {t("MFA.ENTER_PHONE_OTP")}
            </label>
            <OtpInputComponent
              isChecked={checkSMSResult.isSuccess}
              input={{
                id: "registration-acc-number-otp",
              }}
              isSubmitting={
                resendSMSResult.isLoading || checkSMSResult.isLoading
              }
              btnLabel={t("BUTTONS.CHECK")}
              resendLabel={t("MFA.VERIFICATION_INPUT.RESEND_OTP")}
              onResend={() => {
                console.log("resend sms");
                if (accountNumber && phone) {
                  resendSMS({
                    UserId: accountNumber.toString() || "",
                    PhoneNumber: phone.toString() || "",
                  });
                }
              }}
              onSubmit={(otp) =>
                checkSMSCode({
                  otp,
                  accountNumber: accountNumber?.toString() || "",
                })
              }
            />
          </Grid>
        </Grid>
      </div>

      <div className="registration__input-container">
        <label
          className="registration__label required"
          title={t("MESSAGES.REGISTRATION_BIRTH_DATES_TOOLTIP")}
          htmlFor="phone-input"
          aria-label={t("LABELS.ENTER_BIRTH_DATE")}
        >
          {t("LABELS.ENTER_BIRTH_DATE")}
        </label>
        <OtpInputComponent
          isChecked={checkDOBResult.isSuccess}
          isSubmitting={checkDOBResult.isLoading}
          onSubmit={() =>
            dob &&
            checkDOB({
              dob: dob.toISOString(),
              accountNumber: accountNumber?.toString() || "",
            })
          }
          btnLabel={t("BUTTONS.CHECK")}
          resendLabel={t("BUTTONS.VERIFY")}
          onResend={() => {}}
          input={{
            useDatePicker: {
              format: "DD/MM/YYYY",
              value: dob,
              onChange: setDOB,
            },
          }}
        />
      </div>
      <form className="registration__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="registration__input-container">
          <Grid container spacing={2}>
            <Grid size={12}>
              <label
                htmlFor="password-label"
                className="registration__label required"
                title={t("MESSAGES.CUSTOMER_PASSWORD_TOOLTIP")}
              >
                {t("LABELS.PASSWORD")}
              </label>
              <TextInput
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
                type="password"
              />
            </Grid>
            <Grid size={12}>
              <label
                htmlFor="confirm-password-label"
                className="registration__label  required"
                title={t("MESSAGES.CUSTOMER_PASSWORD_TOOLTIP")}
              >
                {t("LABELS.CONFIRM_PASSWORD")}
              </label>

              <TextInput
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
                type="password"
              />
            </Grid>
          </Grid>
          <PasswordCheckList {...passwordConfig} value={passwordValue} />
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
          className="button registration__button"
          role="button"
          disabled={
            !checkSMSResult.isSuccess ||
            !checkEmailResult.isSuccess ||
            !checkDOBResult.isSuccess ||
            !formState.isDirty ||
            !formState.isValid
          }
        >
          {t("SIGN_UP.BUTTONS.NEXT")}
        </button>
      </form>
    </Box>
  );
};
