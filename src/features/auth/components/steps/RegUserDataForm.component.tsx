import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IntlTelInputComponent } from "../../../../shared/components/IntlTelInput.component";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { UserDataDto } from "../../../../shared/dtos/user.dto";
import { selectUser, setUser } from "../../../../shared/redux/slices/authSlice";

import { useForm } from "react-hook-form";
import { getErrorMessage } from "../../../../shared/utils/getErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Iti } from "intl-tel-input";
import { setError } from "../../../../shared/redux/slices/errorSlice";
import StorageService from "../../../../shared/services/Storage.service";
import { IntlTelInputRef } from "intl-tel-input/react";
const { default: utils } = require("intl-tel-input/build/js/utils.js");
export const RegUserDataFormComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const iniTelReff = useRef<IntlTelInputRef>();
  const iniTelinst = useRef<Iti>();
  const { email, phone, accountNumber } = useSelector(selectUser) || {};
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    formState,
  } = useForm<UserDataDto>({ mode: "all", defaultValues: { accountNumber } });

  const onSubmit = ({ accountNumber, email, phone }: UserDataDto) => {
    if (StorageService.getBoolean("cookieBanner")) {
      const countryData = iniTelReff.current
        ?.getInstance()
        ?.getSelectedCountryData();
      dispatch(
        setUser({
          accountNumber,
          email,
          phone,
          phoneCountryCode: countryData?.dialCode,
          phoneExcludingCountryCode: phone.replace(
            countryData?.dialCode || "353",
            "",
          ),
        }),
      );
    } else {
      dispatch(setError({ message: t("ERRORS.PLS_ACCEPT_COOKIE") }));
    }
  };

  if (!accountNumber) {
    return <div>Loading...</div>;
  }

  if (formState.isSubmitted && email && phone) {
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
          <TextField
            id="phone-input"
            error={!!errors.phone}
            helperText={getErrorMessage(errors.phone?.message)}
            slotProps={{
              htmlInput: {
                "aria-invalid": !!errors.phone,
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
                  getIti: (obj: IntlTelInputRef) => {
                    console.log("set IntlTelInputRef", {
                      input: obj.getInput(),
                      instance: obj.getInstance(),
                    });
                    iniTelReff.current = obj;
                    const instance = obj.getInstance();
                    if (instance) {
                      iniTelinst.current = instance;
                    }
                  },
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    const countryData = iniTelReff.current
                      ?.getInstance()
                      ?.getSelectedCountryData();
                    const phone = `+${countryData?.dialCode}${value}`;
                    console.log("onChange", phone, value, utils, countryData);

                    setValue("phone", phone);
                  },
                },
              },
            }}
            {...register("phone", {
              required: true,
              validate: (value) => {
                const countryData = iniTelReff.current
                  ?.getInstance()
                  ?.getSelectedCountryData();
                let isValid = utils.isValidNumber(value, countryData?.iso2);
                if (isValid) {
                  return true;
                } else {
                  return t("ERRORS.INVALID_PHONE");
                }
              },
            })}
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
            !formState.isDirty ||
            !formState.isValid ||
            iniTelReff.current?.getInstance()?.isValidNumber() === false
          }
        >
          {t("SIGN_UP.BUTTONS.NEXT")}
        </button>
      </form>
    </div>
  );
};
