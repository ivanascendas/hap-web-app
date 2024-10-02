import React from "react";
import { Link } from "react-router-dom";
import { LoginDto } from "../../../shared/dtos/login.dto";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ReCAPTCHA from "react-google-recaptcha";

import logo from "../../../assets/img/custom/logo.png";
import { useForgotPasswordMutation } from "../../../shared/services/Auth.service";

import { TextField } from "@mui/material";
import "../Auth.component.scss";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";
import { MainComponent } from "../../main/Main.component";

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
        <div className="auth-form forgot-password">
          <div className="auth-form__logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="auth-form__title">{t("FORGOT_PASSWORD.TITLE")}</div>
          <form
            className="auth-form__form"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className="auth-form__input-container account-number">
              <TextField
                {...register("username", { required: true })}
                error={!!errors.username}
                aria-invalid={errors.username ? "true" : "false"}
                label={t("LABELS.CUSTOMER_NUMBER")}
                variant={"outlined"}
                helperText={getErrorMessage(errors.username?.type, t)}
              />
            </div>
            <div className="auth-form__input-container ">
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
