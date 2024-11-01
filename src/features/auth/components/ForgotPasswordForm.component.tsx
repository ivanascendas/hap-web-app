import React, { useEffect } from "react";
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
import { NotificationComponent } from "../../../shared/components/Notification.component";
import { setError } from "../../../shared/redux/slices/errorSlice";
import { setNotify } from "../../../shared/redux/slices/notifySlice";
import { useDispatch } from "react-redux";
import StorageService from "../../../shared/services/Storage.service";

export const ForgotPasswordFormComponent = (): JSX.Element => {
  const [forgotPassword, result] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<LoginDto>({ mode: "all" });

  const [GCaptchaResponse, setCaptchaString] = React.useState("");

  const submitHandler = ({ username }: LoginDto) => {
    if (StorageService.getBoolean("cookieBanner")) {
      const accountNumber = username;
      forgotPassword({ accountNumber, GCaptchaResponse });
    } else {
      dispatch(setError({ message: t("ERRORS.PLS_ACCEPT_COOKIE") }));
    }
  };

  const handleRecaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    if (value != null) setCaptchaString(value);
  };
  useEffect(() => {
    console.log(result);
    if (result.isSuccess) {
      dispatch(setNotify({
        message: t("MESSAGES.RESET_PASSWORD")
      }));
    }
  }, [result]);

  return (
    <MainComponent>
      <div className="auth-container">
        <div className="auth-form forgot-password">
          <div className="auth-form__logo">
            <img src={logo} alt="logo" />
          </div>
          <NotificationComponent />
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
                formState.isSubmitting ||
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
