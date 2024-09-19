import React from "react";
import { MainComponent } from "../../main/Main.component";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";
import { SelectLanguage } from "../../../shared/components/SelectLanguage";
import logo from "../../../assets/img/custom/logo.png";
import { RegistrationStepper } from "./steps/RegistrationStepper.component";

export const RegistrationComponent = (): JSX.Element => {
  const { step } = useParams();
  console.log({ step });
  return (
    <MainComponent>
      <div className="auth-container">
        <div className="auth-form registration">
          <div className="auth-form__logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="auth-form__subtitle">
            {t("SIGN_UP.ALREADY_REGISTERED")}
            <Link to="/login">{t("APP.HEADER.BUTTONS.LOGIN")}</Link>
          </div>
          <div className="auth-form__title">{t("SIGN_UP.TITLE")}</div>

          <RegistrationStepper step={step || "step1"} />

          <div className="auth-form__subtitle">
            {t("SIGN_UP.NEED_HELP")}{" "}
            <Link to="">{t("SIGN_UP.BUTTONS.GET_IN_TOUCH")}</Link>
          </div>
          <div className="lang-dropdown">
            <SelectLanguage />
          </div>
          <footer>
            {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}{" "}
            <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
          </footer>
        </div>
      </div>
    </MainComponent>
  );
};
