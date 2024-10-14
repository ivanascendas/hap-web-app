import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
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
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../../shared/redux/slices/authSlice";
import { MfaLogin } from "./MfaLogin.component";
import { MFAMethod } from "../../../shared/dtos/user.dto";

export const LoginFormComponent = (): JSX.Element => {
  const [checkTempPassword, result] = useCheckTempPasswordMutation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { defaultMFA } = useSelector(selectUser) || {};
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
    getValues
  } = useForm<LoginDto>({ mode: "all" });



  const submitHandler = ({ username, password }: LoginDto) => {
    const accountNumber = username;
    const tempPassword = password;
    checkTempPassword({ accountNumber, tempPassword });
  };

  if (
    result.isSuccess &&
    !result.data?.code &&
    result.originalArgs?.accountNumber
  ) {
    return (
      <Navigate to="/registration/step1" state={{ from: location }} replace />
    );
  }
  return (
    <MainComponent>
      <div className="auth-container">
        <div className="auth-form" role="main">
          <div className="auth-form__logo">
            <img src={logo} alt="logo" />
          </div>
          {defaultMFA && defaultMFA !== 'None' ? <MfaLogin username={getValues().username} password={getValues().password} mfa={defaultMFA} /> : <>
            <h1 className="auth-form__title">{t("SIGN_IN.TITLE")}</h1>
            <div className="auth-form__subtitle">{t("SIGN_IN.SUB_TITLE")}</div>
            <form
              className="auth-form__form"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div className="auth-form__input-container account-number">
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
              <div className="input-container auth-form__input-container account-password">
                <TextField
                  {...register("password", { required: true })}
                  error={!!errors.password}
                  aria-invalid={errors.password ? "true" : "false"}
                  placeholder={isMobile ? undefined : t("LABELS.PASSWORD")}
                  label={isMobile ? t("LABELS.PASSWORD") : undefined}
                  type={showPassword ? "text" : "password"}
                  variant={isMobile ? "outlined" : "standard"}
                  helperText={getErrorMessage(errors.password?.type, t)}
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
                className="button-primary mt-20"
                disabled={
                  !formState.isDirty ||
                  !formState.isValid ||
                  formState.isSubmitted
                }
              >
                {t("SIGN_IN.BUTTONS.LOGIN")}
              </button>
              <div className="auth-form__link-holder">
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
          </>}
        </div>
        <footer role="contentinfo">
          {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}{" "}
          <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
        </footer>
      </div>
    </MainComponent>
  );
};
