import React, { useEffect, useState } from "react";
import { MainComponent } from "../../main/main.component";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import "../Auth.component.scss";

import logo from "../../../../assets/img/HAP2.png";
import { ResetPasswordDto } from "@shared/dtos/resetPassword.dto";
import { useResetPasswordMutation } from "@shared/services/Auth.service";
import { NotificationComponent } from "@shared/components/Notification.component";
import { useDispatch } from "react-redux";
import { setNotify } from "@shared/redux/slices/notifySlice";
import { setError } from "@shared/redux/slices/errorSlice";
import StorageService from "@shared/services/Storage.service";
import { PasswordCheckList } from "@components/common/components/PasswordCheckList.component";
import { usePasswordValidator } from "@shared/utils/password.validator";
import { useConfig } from "@shared/providers/Configuration.provider";

export const ResetPasswordComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code") || "";
  const accountNumber = queryParams.get("accountNumber") || "";
  const [resetPassword, result] = useResetPasswordMutation();
  const dispatch = useDispatch();
  const { config } = useConfig();

  const passwordConfig = {
    minLength: config?.passwordMinLength || 8,
    hasNumber: config?.passwordUseNumbers || false,
    hasSpecialChar: config?.passwordUseSpecialCharacter || false,
    hasUpperCase: config?.passwordUseUppercase || false,
    hasLowerCase: config?.passwordUseLowercase || false,
    charRepeating: config?.passwordMaxRepeating || undefined,
  };
  const [isPasswordValid, passwordError] = usePasswordValidator(passwordConfig);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    formState,
    setError: setFromError,
  } = useForm<ResetPasswordDto>({
    mode: "all",
    defaultValues: { accountNumber, code },
  });

  const submitHandler = (dto: ResetPasswordDto) => {
    if (!formState.isValid) return;
    if (StorageService.getBoolean("cookieBanner")) {
      resetPassword(dto);
    } else {
      dispatch(setError({ message: t("ERRORS.PLS_ACCEPT_COOKIE") }));
    }
  };

  useEffect(() => {
    console.log(result);
    if (result.isSuccess) {
      dispatch(
        setNotify({
          message: t("MESSAGES.PASSWORD_IS_CHANGED"),
        }),
      );
    } else if (result.isError) {
      if ((result.error as any).data?.modelState) {
        if ((result.error as any).data?.modelState["model.ConfirmPassword"]) {
          setFromError("confirmPassword", {
            type: t(
              (result.error as any).data?.modelState[
                "model.ConfirmPassword"
              ][0],
            ),
          });
        }
        if ((result.error as any).data?.modelState["model.Password"]) {
          setFromError("password", {
            type: t(
              (result.error as any).data?.modelState["model.Password"][0],
            ),
          });
        }
        if ((result.error as any).data?.modelState[""]) {
          dispatch(
            setError({
              message: t((result.error as any).data?.modelState[""]),
            }),
          );
        }
      }
    }
  }, [result]);

  return (
    <MainComponent>
      <div className="auth-container">
        <div className="auth-container__cover"></div>
        <div className="auth-form reset-password">
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
          <h1 className="auth-form__title">{t("FORGOT_PASSWORD.TITLE")}</h1>

          <form
            className="auth-form__form"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className="input-container auth-form__input-container account-password">
              <TextField
                {...register("password", { required: true })}
                error={!!errors.password}
                aria-invalid={errors.password ? "true" : "false"}
                label={t("LABELS.NEW_PASSWORD")}
                type={showPassword ? "text" : "password"}
                variant={"outlined"}
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
            <div className="input-container auth-form__input-container account-password">
              <TextField
                {...register("confirmPassword", { required: true })}
                error={!!errors.confirmPassword}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                label={t("LABELS.CONFIRM_NEW_PASSWORD")}
                type={showPassword ? "text" : "password"}
                variant={"outlined"}
                helperText={getErrorMessage(errors.confirmPassword?.type, t)}
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
            <PasswordCheckList {...passwordConfig} value={watch("password")} />
            <button
              type="submit"
              className="button"
              disabled={
                !formState.isDirty ||
                !formState.isValid ||
                formState.isSubmitting
              }
            >
              {t("CONTENTS.BUTTON.RESET")}
            </button>
          </form>
        </div>
      </div>
    </MainComponent>
  );
};
