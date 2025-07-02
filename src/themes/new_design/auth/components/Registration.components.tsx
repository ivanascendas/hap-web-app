import React from "react";
import { MainComponent } from "../../main/main.component";
import { Link, useParams } from "react-router-dom";
import { SelectLanguage } from "@shared/components/SelectLanguage";
import logo from "../../../../assets/img/custom/logo.png";
import { RegistrationStepper } from "./steps/RegistrationStepper.component";

import "../Auth.component.scss";
import { useTranslation } from "react-i18next";
import { NotificationComponent } from "@shared/components/Notification.component";

export const RegistrationComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const { step } = useParams();
  console.log({ step });
  const stepNumber = parseInt(step?.replace("step", "") || "1", 10);
  return (
    <MainComponent>
      <div className="auth-container">
        <div className="auth-container__cover"></div>

        <div className="auth-form registration">
          <div className="auth-form__logo">
            <img src={logo} alt="logo" />
          </div>
          <div
            className="auth-form__help mt-20 far fa-question-circle"
            role="dialog"
            aria-label={t("SIGN_UP.BUTTONS.GET_IN_TOUCH")}
          >
            {t("SIGN_UP.NEED_HELP")}
          </div>
          <div className="auth-form__container">
            {step !== "step1" && (
              <Link
                className="button-secondary back-btn registration__back"
                to={`/registration/step${stepNumber > 1 ? stepNumber - 1 : 1}`}
              >
                {t("BUTTONS.BACK")}
              </Link>
            )}
            <h1 className="auth-form__title">{t("SIGN_UP.TITLE")}</h1>
            <div>
              <RegistrationStepper step={step || "step1"} />
            </div>
            <div className="auth-form__subtitle" role="navigation">
              {t("SIGN_UP.ALREADY_REGISTERED")}
              <Link to="/login" className="link-underline">
                {t("APP.HEADER.BUTTONS.LOGIN")}
              </Link>
            </div>

            {/* <div className="lang-dropdown" role="region">
              <SelectLanguage />
            </div> */}
          </div>
        </div>
      </div>
    </MainComponent>
  );
};
