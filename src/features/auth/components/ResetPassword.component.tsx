import React, { useEffect, useState } from "react";
import { MainComponent } from "../../main/Main.component";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";
import { useForm } from "react-hook-form";
import { useLocation } from 'react-router-dom';

import "../Auth.component.scss";

import logo from "../../../assets/img/custom/logo.png";
import { ResetPasswordDto } from "../../../shared/dtos/resetPassword.dto";
import { useResetPasswordMutation } from "../../../shared/services/Auth.service";
import { NotificationComponent } from "../../../shared/components/Notification.component";
import { useDispatch } from "react-redux";
import { setNotify } from "../../../shared/redux/slices/notifySlice";
import { setError } from "../../../shared/redux/slices/errorSlice";
import StorageService from "../../../shared/services/Storage.service";


export const ResetPasswordComponent = (): JSX.Element => {
    const { t } = useTranslation();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code") || '';
    const accountNumber = queryParams.get("accountNumber") || '';
    const [resetPassword, result] = useResetPasswordMutation();
    const dispatch = useDispatch();

    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        formState,
        setError: setFromError
    } = useForm<ResetPasswordDto>({ mode: "all", defaultValues: { accountNumber, code } });

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
            dispatch(setNotify({
                message: t("MESSAGES.PASSWORD_IS_CHANGED")
            }));
        } else if (result.isError) {
            if ((result.error as any).data.modelState) {
                if ((result.error as any).data.modelState['model.ConfirmPassword']) {
                    setFromError('confirmPassword', {
                        type: t((result.error as any).data.modelState['model.ConfirmPassword'][0]),
                    });
                }
                if ((result.error as any).data.modelState['model.Password']) {
                    setFromError('password', {
                        type: t((result.error as any).data.modelState['model.Password'][0]),
                    });
                }
                if ((result.error as any).data.modelState['']) {
                    dispatch(setError({ message: t((result.error as any).data.modelState['']) }));
                }
            }
        }
    }, [result]);

    return (
        <MainComponent>
            <div className="auth-container">
                <div className="auth-form reset-password">
                    <div className="auth-form__logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <NotificationComponent />
                    <div className="auth-form__title">{t("FORGOT_PASSWORD.TITLE")}</div>
                    <div className="auth-form__subtitle">{t("LABELS.PASSWORDS_INFO")}</div>
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
                        <button
                            type="submit"
                            className="button-primary"
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
                <footer>
                    {new Date().getFullYear()} {t("APP.FOOTER_TEXT")}{" "}
                    <Link to="/policy"> {t("MAIN.MENU.DATA_POLICY")}</Link>
                </footer>
            </div>
        </MainComponent>
    );
}