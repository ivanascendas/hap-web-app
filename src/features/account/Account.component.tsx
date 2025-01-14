import React, { useEffect, useRef, useState } from "react";
import "./Account.component.scss";
import {
  Box,
  FormHelperText,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../shared/redux/slices/authSlice";
import { selectUserLoading } from "../../shared/redux/slices/loaderSlice";

import {
  useEmailConfirmationMutation,
  useEmailConfirmationRequestMutation,
  usePhoneConfirmationMutation,
  usePhoneConfirmationRequestMutation,
  useSaveUserDataMutation,
} from "../../shared/services/Auth.service";
import { ExsistingTenantDto } from "../../shared/dtos/existing-tenant.dto";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import UserIcon from "@mui/icons-material/Person";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { IntlTelInputComponent } from "../../shared/components/IntlTelInput.component";
import { Iti } from "intl-tel-input";
import { NotificationComponent } from "../../shared/components/Notification.component";
import { MFAMethod } from "../../shared/dtos/user.dto";
import { OTPConfirmPopupComponent } from "./compomnents/OTPConfirmPopup.component";
import { MFAControlComponent } from "./compomnents/MFAControl.component";
import { PasswordsFormComponent } from "./compomnents/PasswordsForm.component";
import { IntlTelInputRef } from "intl-tel-input/react";

const { default: utils } = require("intl-tel-input/build/js/utils.js");

export const AccountComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const [updateUser, result] = useSaveUserDataMutation();
  const [smsRequest] = usePhoneConfirmationRequestMutation();
  const [emailRequest] = useEmailConfirmationRequestMutation();
  const [smsConfirm, smsConfirmResult] = usePhoneConfirmationMutation();
  const [emailConfirm, emailConfirmResult] = useEmailConfirmationMutation();
  const iniTelReff = useRef<IntlTelInputRef>();
  const iniTelinst = useRef<Iti>();
  const [tabValue, setTabValue] = useState(0);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const isPhoneDirty = useRef<boolean>(false);
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
    defaultValues: {
      EmailId: user?.email || "",
      PhoneNumber: user?.phone || "",
      PhoneNumberConfirmed: user?.phoneNumberConfirmed || false,
      EmailConfirmed: user?.emailConfirmed || false,
      DefaultMFA: user?.defaultMFA || "Email",
      PhoneCountryCode: user?.phoneCountryCode || "353",
      PhoneExcludingCountryCode:
        user?.phone?.replace(user?.phoneCountryCode || "353", "") || "",
    },
  });

  const onSubmit = ({
    EmailId,
    PhoneNumber,
    EmailConfirmed,
    PhoneNumberConfirmed,
    DefaultMFA,
  }: ExsistingTenantDto) => {
    const countryData = iniTelReff.current
      ?.getInstance()
      ?.getSelectedCountryData();
    const phone = PhoneNumber.replace("+", "");
    const model: ExsistingTenantDto = {
      EmailId,
      PhoneNumber: `${phone}`,
      PhoneCountryCode: countryData?.dialCode || "353",
      PhoneExcludingCountryCode: phone.replace(
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!isLoading && user?.defaultMFA) {
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
      // console.log("reset", { data, iniTelReff: iniTelReff ? 'initalized' : 'not initalized' });
      iniTelReff.current?.getInstance()?.setNumber(`+${data.PhoneNumber}`);

      if (isPhoneDirty.current) {
        isPhoneDirty.current = !(
          formState.submitCount === 0 &&
          (smsConfirmResult.isSuccess || emailConfirmResult.isSuccess)
        );
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    const values = getValues();
    const isPhoneNumberConfirmed =
      values.PhoneNumber.replace("+", "") === user?.phone?.replace("+", "");
    const isEmailConfirmed = values.EmailId === user?.email;
    // console.log({ isPhoneNumberConfirmed, isEmailConfirmed, compares: [values.PhoneNumber, user?.phone, values.EmailId, user?.email] });
    setValue("PhoneNumberConfirmed", isPhoneNumberConfirmed);
    setValue("EmailConfirmed", isEmailConfirmed);
  }, [formState]);

  useEffect(() => {
    if (smsConfirmResult.isSuccess) {
      console.log({ smsConfirmResult });
      dispatch(
        setUser({
          phone: getValues("PhoneNumber").replace("+", ""),
          phoneNumberConfirmed: true,
        }),
      );
      setShowOtpPopup(false);
    }
    if (emailConfirmResult.isSuccess) {
      dispatch(setUser({ email: getValues("EmailId"), emailConfirmed: true }));
      setShowOtpPopup(false);
    }
  }, [smsConfirmResult.isSuccess, emailConfirmResult.isSuccess]);

  //  console.log({ values: getValues(), formState, submitDis: !((smsConfirmResult.isSuccess || emailConfirmResult.isSuccess) && formState.submitCount === 0), smsisSuccess: smsConfirmResult.isSuccess, emailisSuccess: emailConfirmResult.isSuccess });
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
            className={`account_form ${tabValue === 0 ? "active" : ""} ${isLoading && "loading"}`}
            sx={{
              display: { sm: tabValue === 0 ? "block" : "none", md: "block" },
            }}
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
                  <Skeleton
                    width={"100%"}
                    height={" 2.625rem"}
                    variant="rounded"
                  />
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
                  <Skeleton
                    width={"100%"}
                    height={" 2.625rem"}
                    variant="rounded"
                  />
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
                  <Skeleton
                    width={"100%"}
                    height={" 2.625rem"}
                    variant="rounded"
                  />
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

                {isLoading ? (
                  <Skeleton
                    width={"100%"}
                    height={"2.625rem"}
                    variant="rounded"
                  />
                ) : (
                  <TextField
                    id="phone-input"
                    error={!!errors.PhoneNumber}
                    helperText={getErrorMessage(errors.PhoneNumber?.message)}
                    slotProps={{
                      htmlInput: {
                        "aria-invalid": !!errors.PhoneNumber,
                      },
                      input: {
                        inputComponent: IntlTelInputComponent,
                        inputProps: {
                          options: {
                            initialCountry: "ie",
                            separateDialCode: true,
                            formatOnDisplay: true,
                            formatAsYouType: true,
                          },
                          getIti: (obj: IntlTelInputRef) => {
                            console.log("set IntlTelInputRef", {
                              input: obj.getInput(),
                              instance: obj.getInstance(),
                            });
                            iniTelReff.current = obj;
                            const instance = obj.getInstance();
                            if (instance) {
                              iniTelinst.current = instance;
                            }
                          },
                          onChange: (
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const { value } = e.target;
                            const countryData = iniTelReff.current
                              ?.getInstance()
                              ?.getSelectedCountryData();
                            const phone = `+${countryData?.dialCode}${value}`;
                            console.log(
                              "onChange",
                              phone,
                              value,
                              utils,
                              countryData,
                            );

                            setValue("PhoneNumber", phone);
                          },
                        },
                      },
                    }}
                    {...register("PhoneNumber", {
                      required: true,
                      validate: (value) => {
                        const countryData = iniTelReff.current
                          ?.getInstance()
                          ?.getSelectedCountryData();
                        const isValid = utils.isValidNumber(
                          value,
                          countryData?.iso2,
                        );
                        if (isValid) {
                          return true;
                        } else {
                          return t("ERRORS.INVALID_PHONE");
                        }
                      },
                    })}
                  />
                )}
              </Box>
              <Box
                sx={{ display: { sm: "block", md: "none" } }}
                className="account_form_row MFA"
              >
                {!isLoading ? (
                  <MFAControlComponent
                    defaultValue={watch("DefaultMFA")} // Add this line
                    onChange={(e) =>
                      setValue("DefaultMFA", e.target.value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  />
                ) : (
                  <Skeleton
                    width={"20.25rem"}
                    height={"12.5rem"}
                    variant="rounded"
                  />
                )}
              </Box>
              <Box className="account_form_row">
                <button
                  className="button-primary mt-20"
                  disabled={
                    (isPhoneDirty.current === false && !formState.isDirty) ||
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
              display: { sm: tabValue === 1 ? "block" : "none", md: "block" },
            }}
            className={`account_form ${tabValue === 1 ? "active" : ""} `}
          >
            <PasswordsFormComponent isLoading={isLoading} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{ display: { sm: "none", md: "block" } }}
                className="account_form_row MFA"
              >
                {!isLoading ? (
                  <MFAControlComponent
                    //{...register("DefaultMFA")}
                    defaultValue={watch("DefaultMFA")} // Add this line
                    onChange={(e) => {
                      setValue("DefaultMFA", e.target.value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                ) : (
                  <Skeleton
                    width={"20.25rem"}
                    height={"12.5rem"}
                    variant="rounded"
                  />
                )}
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
      <OTPConfirmPopupComponent
        isChecked={getValues().PhoneNumberConfirmed}
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
        isChecked={getValues().EmailConfirmed}
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
