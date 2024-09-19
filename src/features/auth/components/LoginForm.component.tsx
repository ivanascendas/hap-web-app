import React from "react";
import { Link } from "react-router-dom";
import { LoginDto } from "../../../shared/dtos/login.dto";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectLanguage } from "../../../shared/components/SelectLanguage";
import { useState } from "react";
import { TextField } from "@mui/material";
import "../Auth.component.scss";

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
              <input
                {...register("username", { required: true })}
                aria-invalid={errors.username ? "true" : "false"}
                placeholder={t("LABELS.CUSTOMER_NUMBER")}
              />
              {errors.username?.type === "required" && (
                <p role="alert" className="error">
                  {t("ERRORS.REQUIRED")}
                </p>
              )}
            </div>
            <div className="input-container login-form__input-container account-password">
              <input
                {...register("password", { required: true })}
                aria-invalid={errors.password ? "true" : "false"}
                placeholder={t("LABELS.PASSWORD")}
                type={showPassword ? "text" : "password"}
              />
              <div
                className="password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </div>

              {errors.password?.type === "required" && (
                <p role="alert" className="error">
                  {t("ERRORS.REQUIRED")}
                </p>
              )}
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
