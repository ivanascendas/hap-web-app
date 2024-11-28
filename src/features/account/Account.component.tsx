import React, { useEffect, useState } from "react";
import "./Account.component.scss";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../shared/redux/slices/authSlice";
import { selectLoading } from "../../shared/redux/slices/loaderSlice";
import {
  useChangePasswordMutation,
  useCheckValidContactMutation,
  useEmailConfirmationMutation,
  useEmailConfirmationRequestMutation,
  usePhoneConfirmationMutation,
  usePhoneConfirmationRequestMutation,
  useSaveUserDataMutation,
} from "../../shared/services/Auth.service";
import { ExsistingTenantDto } from "../../shared/dtos/existing-tenant.dto";
import { FieldPath, set, useForm } from "react-hook-form";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import UserIcon from "@mui/icons-material/Person";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { IntlTelInput } from "../../shared/components/IntlTelInput.component";
import { Iti } from "intl-tel-input";
import { ChangePasswordDto } from "../../shared/dtos/change-password.dto";
import { use } from "i18next";
import { NotificationComponent } from "../../shared/components/Notification.component";
import { de } from "intl-tel-input/i18n";
import { MFAMethod } from "../../shared/dtos/user.dto";
import { OTPConfirmPopupComponent } from "./compomnents/OTPConfirmPopup.component";

export const AccountComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectLoading);
  const [updateUser, result] = useSaveUserDataMutation();
  const [changePassword, changePassResult] = useChangePasswordMutation();
  const [smsRequest] = usePhoneConfirmationRequestMutation();
  const [emailRequest] = useEmailConfirmationRequestMutation();
  const [smsConfirm, smsConfirmResult] = usePhoneConfirmationMutation();
  const [emailConfirm, emailConfirmResult] = useEmailConfirmationMutation();
  const [iniTelReff, setIti] = useState<Iti>();
  const [tabValue, setTabValue] = useState(0);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
    getValues,
    setError: setFromError,
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<ExsistingTenantDto>({
    mode: "all",
  });

  const {
    register: registerPasswords,
    formState: { errors: errorsPasswords },
    handleSubmit: handleSubmitPasswords,
    formState: formStatePasswords,
    getValues: getValuesPasswords,
    setError: setPasswordsFromError,
  } = useForm<ChangePasswordDto>({
    mode: "all",
  });

  const onSubmit = ({
    EmailId,
    PhoneNumber,
    EmailConfirmed,
    PhoneNumberConfirmed,
    DefaultMFA,
  }: ExsistingTenantDto) => {
    const countryData = iniTelReff?.getSelectedCountryData();
    const model: ExsistingTenantDto = {
      EmailId,
      PhoneNumber: `${countryData?.dialCode || "353"}${PhoneNumber}`,
      PhoneCountryCode: countryData?.dialCode || "353",
      PhoneExcludingCountryCode: PhoneNumber.replace(
        countryData?.dialCode || "353",
        "",
      ),
      DefaultMFA,
      EmailConfirmed,
      PhoneNumberConfirmed,
    };
    if (model.EmailConfirmed && model.PhoneNumberConfirmed) {
      dispatch(
        setUser({
          defaultMFA: model.DefaultMFA as MFAMethod,
          email: model.EmailId,
          phone: model.PhoneNumber,
          phoneCountryCode: model.PhoneCountryCode,
          phoneExcludingCountryCode: model.PhoneExcludingCountryCode,
          emailConfirmed: model.EmailConfirmed,
          phoneNumberConfirmed: model.PhoneNumberConfirmed,
        }),
      );

      updateUser(model).then(() => {
        console.log({ model });
        reset(model, {
          keepValues: true,
          keepDirty: false,
          keepIsValid: false,
        });
      });
    } else {
      setShowOtpPopup(true);
    }
  };

  const onPasswordSubmit = ({
    oldPassword,
    newPassword,
    confirmPassword,
  }: ChangePasswordDto) => {
    changePassword({ oldPassword, newPassword, confirmPassword });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!isLoading && user?.defaultMFA) {
      console.log({ user });
      const data: ExsistingTenantDto = {
        EmailConfirmed: user?.emailConfirmed || false,
        PhoneNumberConfirmed: user?.phoneNumberConfirmed || false,
        PhoneNumber: user?.phone || "",
        EmailId: user?.email || "",
        DefaultMFA: user?.defaultMFA || "Email",
        PhoneCountryCode: user?.phoneCountryCode || "353",
        PhoneExcludingCountryCode:
          user?.phone?.replace(user?.phoneCountryCode || "353", "") || "",
      };

      reset(data);
    }
  }, [user, isLoading]);

  useEffect(() => {
    const values = getValues();
    setValue("PhoneNumberConfirmed", values.PhoneNumber === user?.phone);
    setValue("EmailConfirmed", values.EmailId === user?.email);
  }, [formState]);

  useEffect(() => {
    if (changePassResult.isSuccess) {
      setValue("PhoneNumberConfirmed", true, { shouldValidate: true });
    }
    if (emailConfirmResult.isSuccess) {
      setValue("EmailConfirmed", true, { shouldValidate: true });
    }
  }, [smsConfirmResult.isSuccess, emailConfirmResult.isSuccess]);

  const onChangePhoneValidation = (isValid: boolean, errorCode?: number) => {
    console.log({ isValid, errorCode });
    // trigger('PhoneNumber');
  };

  const { isDirty, isValid, isSubmitting } = formState;
  console.log({ values: getValues(), isDirty, isValid, isSubmitting });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <NotificationComponent />
      <Box sx={{ flexGrow: 1 }} className="account">
        <Typography variant="h1" className="account_header">
          {t("ACCOUNT.TITLE")}
        </Typography>
        <Box sx={{ display: { sm: "block", md: "none" } }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="icon label tabs example"
          >
            <Tab
              icon={<UserIcon />}
              iconPosition="start"
              label={t("ACCOUNT.PERSONAL_DETAILS")}
            />
            <Tab
              icon={<LockOpenIcon />}
              iconPosition="start"
              label={t("CONTENTS.NAV.CHANGE_PASSWORD")}
            />
          </Tabs>
        </Box>
        <Box className="personal_box account_content">
          <Box
            sx={{
              display: { sm: tabValue == 0 ? "block" : "none", md: "block" },
            }}
            className={`account_form  ${isLoading && "loading"}`}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: { sm: "none", md: "block" } }}>
                <Typography variant="h2" className="account_form_header">
                  {t("ACCOUNT.PERSONAL_DETAILS")}
                </Typography>
              </Box>
              <Box className="account_form_row">
                <label
                  className=" required"
                  title={t("ACCOUNT.CUSTOMER_NAME")}
                  htmlFor="account-name"
                  aria-label={t("ACCOUNT.CUSTOMER_NAME")}
                >
                  {t("ACCOUNT.CUSTOMER_NAME")}
                </label>
                {!isLoading ? (
                  <TextField
                    id="account-name"
                    value={user?.customerName}
                    aria-readonly
                    disabled
                    slotProps={{
                      htmlInput: {
                        readOnly: true,
                      },
                    }}
                  />
                ) : (
                  <Skeleton width={"100%"} height={"42px"} variant="rounded" />
                )}
              </Box>
              <Box className="account_form_row">
                <label
                  className=" required"
                  title={t("ACCOUNT.CUSTOMER_NAME")}
                  htmlFor="account-number"
                  aria-label={t("ACCOUNT.CUSTOMER_NUMBER")}
                >
                  {t("ACCOUNT.CUSTOMER_NUMBER")}
                </label>
                {!isLoading ? (
                  <TextField
                    id="account-number"
                    placeholder={t("ACCOUNT.CUSTOMER_NUMBER")}
                    value={user?.customerNo}
                    aria-readonly
                    disabled
                    slotProps={{
                      htmlInput: {
                        readOnly: true,
                      },
                    }}
                  />
                ) : (
                  <Skeleton width={"100%"} height={"42px"} variant="rounded" />
                )}
              </Box>
              <Box className="account_form_row">
                <label
                  className=" required"
                  title={t("ACCOUNT.EMAIL")}
                  htmlFor="account-email"
                  aria-label={t("ACCOUNT.EMAIL")}
                >
                  {t("ACCOUNT.EMAIL")}
                </label>
                {!isLoading ? (
                  <TextField
                    id="account-email"
                    placeholder={t("ACCOUNT.EMAIL")}
                    {...register("EmailId", {
                      required: true,
                      pattern:
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    })}
                    error={!!errors.EmailId}
                    helperText={getErrorMessage(errors.EmailId?.type)}
                    slotProps={{
                      htmlInput: {
                        "aria-invalid": !!errors.EmailId,
                      },
                    }}
                  />
                ) : (
                  <Skeleton width={"100%"} height={"42px"} variant="rounded" />
                )}
              </Box>
              <Box className="account_form_row">
                <label
                  className="registration__label label-question required"
                  title={t("MESSAGES.REGISTRATION_PHONE_TOOLTIP")}
                  htmlFor="phone-input"
                  aria-label={t("LABELS.ENTER_PHONE")}
                >
                  {t("LABELS.ENTER_PHONE")}
                </label>
                <Box>
                  {" "}
                  <IntlTelInput
                    id="phone-input"
                    className={`account_form__phone-input`}
                    {...register("PhoneNumber", {
                      required: true,
                      validate: (value) => {
                        if (iniTelReff?.isValidNumber()) {
                          console.log(
                            "valid phone number:",
                            getValues().PhoneNumber,
                          );

                          return true;
                        } else {
                          console.log(
                            "invalid phone number:",
                            iniTelReff?.getNumber(),
                          );
                          return t("ERRORS.INVALID_PHONE");
                        }
                      },
                    })}
                    aria-invalid={!!errors.PhoneNumber}
                    options={{
                      initialCountry: "ie",
                      separateDialCode: true,
                      formatOnDisplay: true,
                      formatAsYouType: true,
                    }}
                    onValidation={onChangePhoneValidation}
                    getIti={setIti}
                  />
                  <FormHelperText error={!!errors.PhoneNumber}>
                    {!!errors.PhoneNumber && t("ERRORS.INVALID_PHONE")}
                  </FormHelperText>
                </Box>
                {isLoading && (
                  <Skeleton width={"100%"} height={"42px"} variant="rounded" />
                )}
              </Box>
              <Box
                sx={{ display: { sm: "block", md: "none" } }}
                className="account_form_row MFA"
              >
                {!isLoading ? (
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-userdata-label">
                      {t("MFA.INFO")}
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-userdata-label"
                      {...register("DefaultMFA")}
                      value={watch("DefaultMFA")} // Add this line
                      onChange={(e) =>
                        setValue("DefaultMFA", e.target.value, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      } // Add this line
                      name="radio-buttons-userdata-group"
                    >
                      <FormControlLabel
                        value="SMS"
                        control={<Radio />}
                        label={t("MFA.TYPES.SMS_OTP")}
                      />
                      <FormControlLabel
                        value="Email"
                        control={<Radio />}
                        label={t("MFA.TYPES.EMAIL_OTP")}
                      />
                      <FormControlLabel
                        value="None"
                        control={<Radio />}
                        label={t("MFA.TYPES.NO_OTP")}
                      />
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Skeleton
                    width={"324px"}
                    height={"200px"}
                    variant="rounded"
                  />
                )}
              </Box>
              <Box className="account_form_row">
                <button
                  className="button-primary mt-20"
                  disabled={
                    !formState.isDirty ||
                    !formState.isValid ||
                    formState.isSubmitting ||
                    isLoading
                  }
                >
                  {t("BUTTONS.UPDATE")}
                </button>
              </Box>
            </form>
          </Box>
          <Box
            sx={{
              display: { sm: tabValue == 1 ? "block" : "none", md: "block" },
            }}
            className={`account_form `}
          >
            <form onSubmit={handleSubmitPasswords(onPasswordSubmit)}>
              <Typography
                variant="body2"
                className="account_form_password_info"
              >
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
                {!isLoading && user?.defaultMFA ? (
                  <TextField
                    id="account-current-password"
                    placeholder={t("ACCOUNT.CURRENT_PASSWORD")}
                    {...registerPasswords("oldPassword", {
                      required: true,
                    })}
                    type="password"
                    helperText={getErrorMessage(
                      errorsPasswords.oldPassword?.type,
                    )}
                    slotProps={{
                      htmlInput: {
                        "aria-invalid": !!errorsPasswords.oldPassword,
                      },
                    }}
                  />
                ) : (
                  <Skeleton width={"100%"} height={"42px"} variant="rounded" />
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
                    helperText={getErrorMessage(
                      errorsPasswords.newPassword?.type,
                    )}
                    slotProps={{
                      htmlInput: {
                        "aria-invalid": !!errorsPasswords.newPassword,
                      },
                    }}
                  />
                ) : (
                  <Skeleton width={"100%"} height={"42px"} variant="rounded" />
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
                    helperText={getErrorMessage(
                      errorsPasswords.confirmPassword?.type,
                    )}
                    slotProps={{
                      htmlInput: {
                        "aria-invalid": !!errorsPasswords.confirmPassword,
                      },
                    }}
                  />
                ) : (
                  <Skeleton width={"100%"} height={"42px"} variant="rounded" />
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{ display: { sm: "none", md: "block" } }}
                className="account_form_row MFA"
              >
                {!isLoading ? (
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      {t("MFA.INFO")}
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      {...register("DefaultMFA")}
                      value={watch("DefaultMFA")} // Add this line
                      onChange={(e) =>
                        setValue("DefaultMFA", e.target.value, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      } // Add this line
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="SMS"
                        control={<Radio />}
                        label={t("MFA.TYPES.SMS_OTP")}
                      />
                      <FormControlLabel
                        value="Email"
                        control={<Radio />}
                        label={t("MFA.TYPES.EMAIL_OTP")}
                      />
                      <FormControlLabel
                        value="None"
                        control={<Radio />}
                        label={t("MFA.TYPES.NO_OTP")}
                      />
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Skeleton
                    width={"324px"}
                    height={"200px"}
                    variant="rounded"
                  />
                )}
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
      <OTPConfirmPopupComponent
        open={showOtpPopup && !getValues().PhoneNumberConfirmed}
        onClose={() => setShowOtpPopup(false)}
        onSendOtp={() =>
          smsRequest({
            PhoneNumber: getValues().PhoneNumber,
            UserId: user?.customerNo || "",
          })
        }
        onConfirm={(otp) =>
          smsConfirm({ code: otp, userId: user?.customerNo || "" })
        }
        type="SMS"
      />
      <OTPConfirmPopupComponent
        onClose={() => setShowOtpPopup(false)}
        onSendOtp={() =>
          emailRequest({
            EmailId: getValues().EmailId,
            UserId: user?.customerNo || "",
          })
        }
        onConfirm={(otp) =>
          emailConfirm({ code: otp, userId: user?.customerNo || "" })
        }
        open={
          showOtpPopup &&
          getValues().PhoneNumberConfirmed &&
          !getValues().EmailConfirmed
        }
        type="Email"
      />
    </Box>
  );
};
