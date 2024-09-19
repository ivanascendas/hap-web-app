import { TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { IntlTelInput } from "../../../../shared/components/IntlTelInput.component";
export const RegUserDataFormComponent = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <div className="registration__subtitle">{t("SIGN_UP.DESCRIPTION")}</div>
      <form>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_NUMBER_TOOLTIP")}
          >
            {t("LABELS.CUSTOMER_NUMBER")}
          </label>
          <TextField />
        </div>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_EMAIL_TOOLTIP")}
          >
            {t("LABELS.ENTER_EMAIL")}
          </label>
          <TextField />
        </div>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_EMAIL_TOOLTIP")}
          >
            {t("LABELS.ENTER_EMAIL")}
          </label>
          <TextField />
        </div>
        <div className="registration__input-container">
          <label
            className="registration__label label-question required"
            title={t("MESSAGES.REGISTRATION_PHONE_TOOLTIP")}
          >
            {t("LABELS.ENTER_PHONE")}
          </label>
          <IntlTelInput className="registration__phone-input" />
        </div>
      </form>
    </>
  );
};
