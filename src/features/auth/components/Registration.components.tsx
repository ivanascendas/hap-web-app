import React from "react";
import { MainComponent } from "../../main/Main.component";
import { Link, useParams } from "react-router-dom";
import { SelectLanguage } from "../../../shared/components/SelectLanguage";
import logo from "../../../assets/img/custom/logo.png";
import { RegistrationStepper } from "./steps/RegistrationStepper.component";

import "../Auth.component.scss";
import { useTranslation } from "react-i18next";

export const RegistrationComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const { step } = useParams();
  console.log({ step });
  return (
    <MainComponent>
      <div className="auth-container">
        <div className="auth-form registration">
          <div role="main" className="auth-form__container">
            <div className="auth-form__logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="auth-form__subtitle" role="navigation">
              {t("SIGN_UP.ALREADY_REGISTERED")}
              <Link to="/login" className="link-underline">
                {t("APP.HEADER.BUTTONS.LOGIN")}
              </Link>
            </div>
            <h1 className="auth-form__title">{t("SIGN_UP.TITLE")}</h1>
            <div>
              <RegistrationStepper step={step || "step1"} />
            </div>
            <div
              className="auth-form__subtitle mt-20"
              role="dialog"
              aria-label={t("SIGN_UP.BUTTONS.GET_IN_TOUCH")}
            >
              {t("SIGN_UP.NEED_HELP")}{" "}
              <Link to="">{t("SIGN_UP.BUTTONS.GET_IN_TOUCH")}</Link>
            </div>
            {/* <div className="lang-dropdown" role="region">
              <SelectLanguage />
            </div> */}
          </div>
          <footer role="contentinfo">
            {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}{" "}
            <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
          </footer>
        </div>
      </div>
    </MainComponent>
  );
};
