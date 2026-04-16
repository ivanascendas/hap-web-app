import React, { useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LoginDto } from "@shared/dtos/login.dto";
import { FieldPath, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectLanguage } from "@shared/components/SelectLanguage";
import { useState } from "react";
import { TextField } from "@mui/material";
import { isAndroid, isIOS, isMobile } from "react-device-detect";
import "../Auth.component.scss";

import androidImg from "../../../../assets/img/google-img.png";
import appleImg from "../../../../assets/img/apple-img.svg";
import logo from "../../../../assets/img/HAP2.png";

import {
  useCheckTempPasswordMutation,
  useLoginMutation,
} from "@shared/services/Auth.service";
import { MainComponent } from "../../main/main.component";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@shared/redux/slices/authSlice";
import { MfaLogin } from "./MfaLogin.component";
import StorageService from "@shared/services/Storage.service";
import { setError } from "@shared/redux/slices/errorSlice";
import { useAuth } from "@shared/providers/Auth.provider";
import { useConfig } from "@shared/providers/Configuration.provider";

export type LoginFormProps = {
  successUrl?: string;
};

/**
 * Login form component.
 *
 * @returns {JSX.Element} A login form component.
 */

export const LoginFormComponent = ({
  successUrl,
}: LoginFormProps): JSX.Element => {
  const [checkTempPassword, result] = useCheckTempPasswordMutation();
  const [login] = useLoginMutation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { defaultMFA } = useSelector(selectUser) || {};
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useConfig();

  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
    getValues,
    setError: setFromError,
  } = useForm<LoginDto>({ mode: "all" });

  const submitHandler = ({ username, password }: LoginDto) => {
    if (StorageService.getBoolean("cookieBanner")) {
      const accountNumber = username;
      const tempPassword = password;
      checkTempPassword({ accountNumber, tempPassword });
    } else {
      dispatch(setError({ message: t("ERRORS.PLS_ACCEPT_COOKIE") }));
    }
  };

  const submitAdminHandler = ({ username, password }: LoginDto) => {
    if (StorageService.getBoolean("cookieBanner")) {
      login({ username, password });
    } else {
      dispatch(setError({ message: t("ERRORS.PLS_ACCEPT_COOKIE") }));
    }
  };

  useEffect(() => {
    if (result.isError) {
      if ((result.error as any).data?.modelState) {
        if ((result.error as any).data?.modelState.tempPassword[0]) {
          dispatch(
            setError({
              message: t(
                (result.error as any).data?.modelState.tempPassword[0],
              ),
            }),
          );
        }
        for (const model in (result.error as any).data?.modelState) {
          setFromError(
            model as FieldPath<LoginDto>,
            (result.error as any).data.modelState[model].join("; "),
          );
        }
      }
    }
  }, [result]);

  useEffect(() => {
    if (auth.isTokenRecived && auth.isAuthenticated) {
      navigate(successUrl || "/statements", {
        state: { from: location },
      });
    }
  }, [auth]);

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
    <MainComponent showFooter={true}>
      <div className="auth-container">
        <div className="auth-container__cover"></div>

        <div className="auth-form login-page">
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

          {defaultMFA && defaultMFA !== "None" ? (
            <MfaLogin
              username={getValues().username}
              password={getValues().password}
              mfa={defaultMFA}
            />
          ) : (
            <>
              <h1 className="auth-form__title">{t("SIGN_IN.TITLE")}</h1>
              {(!successUrl || successUrl === "/statements") && (
                <div className="auth-form__subtitle">
                  {t("SIGN_IN.SUB_TITLE")}
                </div>
              )}
              <form
                className="auth-form__form"
                onSubmit={handleSubmit(
                  !successUrl || successUrl === "/statements"
                    ? submitHandler
                    : submitAdminHandler,
                )}
              >
                <div className="auth-form__input-container account-number">
                  <TextField
                    {...register("username", { required: true })}
                    error={!!errors.username}
                    aria-invalid={errors.username ? "true" : "false"}
                    placeholder={
                      successUrl === "/admin/users"
                        ? "Login"
                        : isMobile || true
                          ? undefined
                          : t("LABELS.CUSTOMER_NUMBER")
                    }
                    label={
                      successUrl === "/admin/users"
                        ? "Login"
                        : isMobile || true
                          ? t("LABELS.CUSTOMER_NUMBER")
                          : undefined
                    }
                    variant={"outlined"}
                    helperText={getErrorMessage(errors.username?.type)}
                  />
                </div>
                <div className="input-container auth-form__input-container account-password">
                  <TextField
                    {...register("password", { required: true })}
                    error={!!errors.password}
                    aria-invalid={errors.password ? "true" : "false"}
                    placeholder={isMobile ? undefined : t("LABELS.PASSWORD")}
                    label={isMobile || true ? t("LABELS.PASSWORD") : undefined}
                    type={showPassword ? "text" : "password"}
                    variant={"outlined"}
                    helperText={getErrorMessage(errors.password?.type, t)}
                  />
                  <div
                    className="password-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={
                        showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                      }
                    ></i>
                  </div>
                </div>
                <div className="auth-form__link-holder">
                  <Link to={"/resetPassword"}>
                    {t("SIGN_IN.BUTTONS.FORGOT_PASSWORD")}
                  </Link>
                </div>
                <button
                  type="submit"
                  className="button"
                  disabled={
                    !formState.isDirty ||
                    !formState.isValid ||
                    formState.isSubmitting ||
                    result.isLoading
                  }
                >
                  {t("SIGN_IN.BUTTONS.LOGIN")}
                </button>

                <div>
                  <div className="app-icons">
                    {isAndroid && (
                      <a href={config?.androidLink}>
                        <img
                          className="android"
                          alt="Get it on Google Play"
                          src={androidImg}
                        />
                      </a>
                    )}
                    {isIOS && (
                      <a href={config?.iosLink}>
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
            </>
          )}
        </div>
      </div>
    </MainComponent>
  );
};
