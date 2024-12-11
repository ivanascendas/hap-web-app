import { useTranslation } from "react-i18next";
import { useChangePasswordMutation } from "../../../shared/services/Auth.service";
import { useForm } from "react-hook-form";
import { ChangePasswordDto } from "../../../shared/dtos/change-password.dto";
import { Typography, Box, TextField, Skeleton } from "@mui/material";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

type PasswordsFormProps = {
  isLoading: boolean;
};
export const PasswordsFormComponent = ({
  isLoading,
}: PasswordsFormProps): JSX.Element => {
  const { t } = useTranslation();

  const [changePassword, changePassResult] = useChangePasswordMutation();

  const {
    register: registerPasswords,
    formState: { errors: errorsPasswords },
    handleSubmit: handleSubmitPasswords,
    formState: formStatePasswords,
    getValues: getValuesPasswords,
    setError: setPasswordsFromError,
  } = useForm<ChangePasswordDto>({
    mode: "all",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
    },
  });

  const onPasswordSubmit = ({
    oldPassword,
    newPassword,
    confirmPassword,
  }: ChangePasswordDto) => {
    changePassword({ oldPassword, newPassword, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmitPasswords(onPasswordSubmit)}>
      <Typography variant="body2" className="account_form_password_info">
        {t("LABELS.PASSWORDS_INFO")}
      </Typography>
      <Box className="account_form_row">
        <label
          className=" required"
          title={t("ACCOUNT.CURRENT_PASSWORD")}
          htmlFor="account-current-password"
          aria-label={t("ACCOUNT.CURRENT_PASSWORD")}
        >
          {t("ACCOUNT.CURRENT_PASSWORD")}
        </label>
        {!isLoading ? (
          <TextField
            id="account-current-password"
            placeholder={t("ACCOUNT.CURRENT_PASSWORD")}
            {...registerPasswords("oldPassword", {
              required: true,
            })}
            type="password"
            helperText={getErrorMessage(errorsPasswords.oldPassword?.type)}
            slotProps={{
              htmlInput: {
                "aria-invalid": !!errorsPasswords.oldPassword,
              },
            }}
          />
        ) : (
          <Skeleton width={"100%"} height={" 2.625rem"} variant="rounded" />
        )}
      </Box>
      <Box className="account_form_row">
        <label
          className=" required"
          title={t("ACCOUNT.NEW_PASSWORD")}
          htmlFor="account-new-password"
          aria-label={t("ACCOUNT.NEW_PASSWORD")}
        >
          {t("ACCOUNT.NEW_PASSWORD")}
        </label>
        {!isLoading ? (
          <TextField
            id="account-new-password"
            {...registerPasswords("newPassword", {
              required: true,
            })}
            placeholder={t("ACCOUNT.NEW_PASSWORD")}
            type="password"
            helperText={getErrorMessage(errorsPasswords.newPassword?.type)}
            slotProps={{
              htmlInput: {
                "aria-invalid": !!errorsPasswords.newPassword,
              },
            }}
          />
        ) : (
          <Skeleton width={"100%"} height={" 2.625rem"} variant="rounded" />
        )}
      </Box>
      <Box className="account_form_row">
        <label
          className=" required"
          title={t("ACCOUNT.CONFIRM_PASSWORD")}
          htmlFor="account-confirm-password"
          aria-label={t("ACCOUNT.CONFIRM_PASSWORD")}
        >
          {t("ACCOUNT.CONFIRM_PASSWORD")}
        </label>
        {!isLoading ? (
          <TextField
            id="account-confirm-password"
            placeholder={t("ACCOUNT.CONFIRM_PASSWORD")}
            {...registerPasswords("confirmPassword", {
              required: true,
            })}
            type="password"
            helperText={getErrorMessage(errorsPasswords.confirmPassword?.type)}
            slotProps={{
              htmlInput: {
                "aria-invalid": !!errorsPasswords.confirmPassword,
              },
            }}
          />
        ) : (
          <Skeleton width={"100%"} height={" 2.625rem"} variant="rounded" />
        )}
      </Box>

      <Box className="account_form_row">
        <button
          className="button-primary mt-20"
          disabled={
            !formStatePasswords.isDirty ||
            !formStatePasswords.isValid ||
            formStatePasswords.isSubmitting ||
            changePassResult.isLoading
          }
        >
          {t("BUTTONS.CHANGE")}
        </button>
      </Box>
    </form>
  );
};
