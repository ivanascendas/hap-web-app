import React from "react";
import { Link } from "react-router-dom";
import { LoginDto } from "../../../shared/dtos/login.dto";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ReCAPTCHA from "react-google-recaptcha";

import logo from "../../../assets/img/custom/logo.png";
import { useForgotPasswordMutation } from "../../../shared/services/Auth.service";
import { MainComponent } from "../../main/Main.component";
import "../Auth.component.scss";

export const ForgotPasswordFormComponent = (): JSX.Element => {
  const [forgotPassword] = useForgotPasswordMutation();
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<LoginDto>({ mode: "all" });

  const [GCaptchaResponse, setCaptchaString] = React.useState("");

  const submitHandler = ({ username }: LoginDto) => {
    const accountNumber = username;
    forgotPassword({ accountNumber, GCaptchaResponse });
  };

  const handleRecaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    if (value != null) setCaptchaString(value);
  };

  return (
    <MainComponent>
      <div className="auth-container">
        <div className="login-form forgot-password">
          <div className="login-form__logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="login-form__title">{t("FORGOT_PASSWORD.TITLE")}</div>
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
            <div className="login-form__input-container ">
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_PUBLIC_KEY || ""}
                onChange={handleRecaptchaChange}
              />
            </div>
            <button
              type="submit"
              className="button-primary"
              disabled={
                !formState.isDirty ||
                !formState.isValid ||
                formState.isSubmitted ||
                !GCaptchaResponse
              }
            >
              {t("CONTENTS.BUTTON.RESET")}
            </button>
            <Link className="button-secondary back-btn" to="/login">
              {t("BUTTONS.BACK_TO_SIGN_IN")}
            </Link>
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
