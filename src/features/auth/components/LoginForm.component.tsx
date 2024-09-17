import { Link } from "react-router-dom";
import { LoginDto } from "../../../shared/dtos/login.dto";
import { CheckTempPasswordRequestDto } from "../../../shared/dtos/tempPassword.dto";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type LoginFormProps = {
  onSubmit: (dto: CheckTempPasswordRequestDto) => void;
};

export const LoginFormComponent = ({
  onSubmit,
}: LoginFormProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginDto>();

  const submitHandler = ({ username, password }: LoginDto) => {
    const accountNumber = username;
    const tempPassword = password;
    onSubmit({ accountNumber, tempPassword });
  };

  return (
    <div className="auth-container">
      <div className="login-form">
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
          <div className="login-form__input-container account-password">
            <input
              {...register("password", { required: true })}
              aria-invalid={errors.password ? "true" : "false"}
              placeholder={t("LABELS.PASSWORD")}
              type="password"
            />
            {errors.password?.type === "required" && (
              <p role="alert" className="error">
                {t("ERRORS.REQUIRED")}
              </p>
            )}
          </div>
          <button type="submit" className="button-primary">
            {t("SIGN_IN.BUTTONS.LOGIN")}
          </button>
          <div className="login-form__link-holder">
            <Link to={"/"}>{t("SIGN_IN.BUTTONS.FORGOT_PASSWORD")}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
