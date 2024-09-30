import React from "react";
import { useTranslation } from "react-i18next";
import { IntlTelInput } from "../../../../shared/components/IntlTelInput.component";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { UserDataDto } from "../../../../shared/dtos/user.dto";
import { selectUser, setUser } from "../../../../shared/redux/slices/authSlice";

import { useForm } from "react-hook-form";
import { getErrorMessage } from "../../../../shared/utils/getErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
export const RegUserDataFormComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const { email, phone, accountNumber } = useSelector(selectUser);

  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<UserDataDto>({ mode: "all", defaultValues: { accountNumber } });

  const onSubmit = ({ accountNumber, email, phone }: UserDataDto) => {
    dispatch(setUser({ accountNumber, email, phone }));
  };

  if (!accountNumber) {
    return <div>Loading...</div>;
  }

  if (formState.isSubmitted && email && phone) {
    console.log({ isSubmitted: formState.isSubmitted, email, phone });
    return (
      <Navigate to="/registration/step2" state={{ from: location }} replace />
    );
  }

  return (
    <div role="form">
      <div className="registration__subtitle">{t("SIGN_UP.DESCRIPTION")}</div>
      <form className="registration__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_NUMBER_TOOLTIP")}
            htmlFor="registration-number"
            aria-label={t("LABELS.CUSTOMER_NUMBER")}
          >
            {t("LABELS.CUSTOMER_NUMBER")}
          </label>
          <TextField
            id="registration-number"
            {...register("accountNumber", {
              required: true,
              pattern: /^\d+$/,
            })}
            error={!!errors.accountNumber}
            slotProps={{
              htmlInput: {
                readOnly: true,
              },
            }}
            value={accountNumber}
            helperText={getErrorMessage(errors.accountNumber?.type)}
          />
        </div>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_EMAIL_TOOLTIP")}
            htmlFor="registration-email"
            aria-label={t("LABELS.ENTER_EMAIL")}
          >
            {t("LABELS.ENTER_EMAIL")}
          </label>
          <TextField
            id="registration-email"
            {...register("email", {
              required: true,
              pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            })}
            error={!!errors.email}
            helperText={getErrorMessage(errors.email?.type)}
            slotProps={{
              htmlInput: {
                "aria-invalid": !!errors.email,
              },
            }}
          />
        </div>

        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_PHONE_TOOLTIP")}
            htmlFor="phone-input"
            aria-label={t("LABELS.ENTER_PHONE")}
          >
            {t("LABELS.ENTER_PHONE")}
          </label>
          <IntlTelInput
            id="phone-input"
            className="registration__phone-input"
            {...register("phone", {
              required: true,
              pattern: /^[0-9]+$/,
            })}
            aria-invalid={!!errors.phone}
            options={{
              initialCountry: "ie",
              separateDialCode: true,
            }}
          />
        </div>
        <div className="registration__input-container">
          <FormControlLabel
            required
            control={
              <Checkbox
                {...register("agreement", {
                  required: true,
                })}
                inputProps={{
                  "aria-invalid": !!errors.agreement,
                }}
              />
            }
            label={t("SIGN_UP.AGREE_TERMS")}
          />
        </div>
        <button
          type="submit"
          className="button-primary registration__button"
          role="button"
          disabled={
            !formState.isDirty || !formState.isValid || formState.isSubmitted
          }
        >
          {t("SIGN_UP.BUTTONS.NEXT")}
        </button>
      </form>
    </div>
  );
};
