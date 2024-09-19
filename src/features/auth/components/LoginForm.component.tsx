import React from "react";
import { Link } from "react-router-dom";
import { LoginDto } from "../../../shared/dtos/login.dto";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectLanguage } from "../../../shared/components/SelectLanguage";
import { useState } from "react";
import { TextField } from "@mui/material";
import { isAndroid, isIOS, isMobile } from "react-device-detect";
import "../Auth.component.scss";

import androidImg from "../../../assets/img/google-img.png";
import appleImg from "../../../assets/img/apple-img.svg";

import logo from "../../../assets/img/custom/logo.png";
import { useCheckTempPasswordMutation } from "../../../shared/services/Auth.service";
import { MainComponent } from "../../main/Main.component";

export const LoginFormComponent = (): JSX.Element => {
  const [checkTempPassword] = useCheckTempPasswordMutation();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<LoginDto>({ mode: "all" });

  const submitHandler = ({ username, password }: LoginDto) => {
    const accountNumber = username;
    const tempPassword = password;
    checkTempPassword({ accountNumber, tempPassword });
  };

  const getErrorMessage = (type?: string): string | undefined => {
    switch (type) {
      case "required":
        return t("ERRORS.REQUIRED");
      case "minLength":
        return t("ERRORS.MIN_LENGTH");
      case "maxLength":
        return t("ERRORS.MAX_LENGTH");
      case "pattern":
        return t("ERRORS.PATTERN");
      default:
        return undefined;
    }
  };

  return (
    <MainComponent>
      <div className="auth-container">
        <div className="login-form">
          <div className="login-form__logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="login-form__title">{t("SIGN_IN.TITLE")}</div>
          <div className="login-form__subtitle">{t("SIGN_IN.SUB_TITLE")}</div>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="login-form__input-container account-number">
              <TextField
                {...register("username", { required: true })}
                error={!!errors.username}
                aria-invalid={errors.username ? "true" : "false"}
                placeholder={isMobile ? undefined : t("LABELS.CUSTOMER_NUMBER")}
                label={isMobile ? t("LABELS.CUSTOMER_NUMBER") : undefined}
                variant={isMobile ? "outlined" : "standard"}
                helperText={getErrorMessage(errors.username?.type)}
              />
            </div>
            <div className="input-container login-form__input-container account-password">
              <TextField
                {...register("password", { required: true })}
                error={!!errors.password}
                aria-invalid={errors.password ? "true" : "false"}
                placeholder={isMobile ? undefined : t("LABELS.PASSWORD")}
                label={isMobile ? t("LABELS.PASSWORD") : undefined}
                type={showPassword ? "text" : "password"}
                variant={isMobile ? "outlined" : "standard"}
                helperText={getErrorMessage(errors.password?.type)}
              />
              <div
                className="password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </div>
            </div>
            <button
              type="submit"
              className="button-primary"
              disabled={
                !formState.isDirty ||
                !formState.isValid ||
                formState.isSubmitted
              }
            >
              {t("SIGN_IN.BUTTONS.LOGIN")}
            </button>
            <div className="login-form__link-holder">
              <Link to={"/resetPassword"}>
                {t("SIGN_IN.BUTTONS.FORGOT_PASSWORD")}
              </Link>
            </div>
            <div>
              <div className="app-icons">
                {isAndroid && (
                  <a href={process.env.REACT_APP_ANDROID_LINK}>
                    <img
                      className="android"
                      alt="Get it on Google Play"
                      src={androidImg}
                    />
                  </a>
                )}
                {isIOS && (
                  <a href={process.env.REACT_APP_IOS_LINK}>
                    <img
                      className="apple"
                      src={appleImg}
                      alt="Download on the App Store"
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="lang-dropdown">
              <SelectLanguage />
            </div>
          </form>
        </div>
        <footer>
          {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}{" "}
          <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
        </footer>
      </div>
    </MainComponent>
  );
};
