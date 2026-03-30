import React, { useEffect, useRef, useState } from "react";
import "./Account.component.scss";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "@shared/redux/slices/authSlice";
import { selectUserLoading } from "@shared/redux/slices/loaderSlice";

import {
  useEmailConfirmationMutation,
  useEmailConfirmationRequestMutation,
  useLogoutMutation,
  usePhoneConfirmationMutation,
  usePhoneConfirmationRequestMutation,
  useSaveUserDataMutation,
} from "@shared/services/Auth.service";
import { ExistingTenantDto } from "@shared/dtos/existing-tenant.dto";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import UserIcon from "@mui/icons-material/Person";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { MFAMethod } from "@shared/dtos/user.dto";
import { OTPConfirmPopupComponent } from "./compomnents/OTPConfirmPopup.component";
import { MFAControlComponent } from "./compomnents/MFAControl.component";
import { PasswordsFormComponent } from "./compomnents/PasswordsForm.component";
import { PasswordConfirmPopupComponent } from "./compomnents/PasswordConfirmPopup.component";
import { IntlTelInputRef } from "intl-tel-input/react";
import { TextInput } from "@components/common/components/TextInput.component";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import { PhoneInput } from "@shared/components/PhoneInput.component";
import { stringToColor } from "@shared/utils/stringToColor";
import { PhoneData } from "@shared/hooks/usePhoneInput";
import { showToast } from "@shared/utils/showToast";

export const AccountComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const [updateUser] = useSaveUserDataMutation();
  const [smsRequest] = usePhoneConfirmationRequestMutation();
  const [emailRequest] = useEmailConfirmationRequestMutation();
  const [smsConfirm, smsConfirmResult] = usePhoneConfirmationMutation();
  const [emailConfirm, emailConfirmResult] = useEmailConfirmationMutation();
  const iniTelReff = useRef<IntlTelInputRef>();
  const [tabValue, setTabValue] = useState(0);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [pendingPassword, setPendingPassword] = useState("");
  const isPhoneDirty = useRef<boolean>(false);
  const phoneData = useRef<PhoneData | null>(null);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
    getValues,
    setValue,
    watch,
    reset,
  } = useForm<ExistingTenantDto>({
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
  }: ExistingTenantDto) => {
    const countryData = iniTelReff.current
      ?.getInstance()
      ?.getSelectedCountryData();
    const phone = PhoneNumber.replace("+", "");
    const model: ExistingTenantDto = {
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
      setShowPasswordPopup(true);
    }
  };

  const handlePasswordConfirmed = (password: string) => {
    setPendingPassword(password);
    setShowPasswordPopup(false);
    setShowOtpPopup(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!isLoading && user?.defaultMFA) {
      const data: ExistingTenantDto = {
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

    setValue("PhoneNumberConfirmed", isPhoneNumberConfirmed);
    setValue("EmailConfirmed", isEmailConfirmed);
  }, [formState]);

  useEffect(() => {
    if (smsConfirmResult.isSuccess) {
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

  const getPhoneDataCallback = useRef<(callback: () => PhoneData) => void>(
    (callback) => {
      phoneData.current = callback();

      if (phoneData.current?.phoneNumber) {
        const newPhone = phoneData.current.localNumber.replace("+", "");
        const currentPhone = getValues("PhoneNumber").replace("+", "");

        if (
          newPhone !== currentPhone ||
          phoneData.current.countryCode !== getValues("PhoneCountryCode")
        ) {
          setValue("PhoneNumber", phoneData.current.phoneNumber);
          setValue("PhoneCountryCode", phoneData.current.countryCode);
          setValue("PhoneExcludingCountryCode", phoneData.current.localNumber);
          isPhoneDirty.current = true;
        }
      }
    },
  );
  const handleMfaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setValue("DefaultMFA", e.target.value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      const data: ExistingTenantDto = {
        EmailConfirmed: user?.emailConfirmed || false,
        PhoneNumberConfirmed: user?.phoneNumberConfirmed || false,
        PhoneNumber: user?.phone || "",
        EmailId: user?.email || "",
        DefaultMFA: e.target.value || "Email",
        PhoneCountryCode: user?.phoneCountryCode || "353",
        PhoneExcludingCountryCode:
          user?.phone?.replace(user?.phoneCountryCode || "353", "") || "",
      };
      await updateUser(data);
    } catch (error) {
      console.error("Error updating MFA method:", error);
      showToast(
        "error",
        t("MESSAGES.MFA_UPDATE_ERROR") || "Error updating MFA method",
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box className="account_header">
        <Box>
          <Typography variant="h1" className="account_title">
            {user?.customerName || t("ACCOUNT.ACCOUNT")}
          </Typography>
          <Typography component={"span"} className="account_subtitle">
            {t("ACCOUNT.CUSTOMER_NUMBER")}: <strong> {user?.customerNo}</strong>
            <IconButton
              aria-label="Copy customer number"
              onClick={() =>
                navigator.clipboard.writeText(user?.customerNo || "")
              }
            >
              <ContentCopyIcon color={"primary"} />
            </IconButton>
          </Typography>
        </Box>
        <Button
          startIcon={<LogoutIcon />}
          className="btn-secondary"
          onClick={() => logout()}
        >
          {t("CONTENTS.NAV.LOGOUT")}
        </Button>
      </Box>
      <Box
        sx={{ flexGrow: 1 }}
        className={
          "account personal_box " + (tabValue === 1 ? "password-tab" : "")
        }
      >
        <Box sx={{ display: { sm: "block" } }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="icon label tabs example"
            variant="fullWidth"
          >
            <Tab
              icon={<UserIcon />}
              iconPosition="start"
              label={t("ACCOUNT.PERSONAL_DETAILS")}
            />
            <Tab
              icon={<LockOpenIcon />}
              iconPosition="start"
              label={t("CONTENTS.NAV.SECURITY")}
            />
          </Tabs>
        </Box>
        <Box className="account_content">
          <Box
            className={`account_form ${tabValue === 0 ? "active" : ""} ${isLoading && "loading"}`}
            sx={{
              display: tabValue === 0 ? "flex" : "none",
              gap: "2.5rem",
            }}
          >
            <Box className="account_avatar_container" sx={{ display: "none" }}>
              <Box className="account_avatar">
                <Avatar
                  alt={user?.customerName}
                  src={undefined}
                  sx={{
                    width: 86,
                    height: 86,
                    bgcolor: stringToColor(user?.customerName || ""),
                    fontSize: 86 * 0.4,
                  }}
                ></Avatar>
              </Box>
              <Box className="account_avatar_controls">
                <Button disabled={true} className="btn-secondary">
                  Remove Avatar
                </Button>
                <Button disabled={true} className="btn-primary">
                  {t("BUTTONS.CHANGE")}
                </Button>
              </Box>
            </Box>
            <form style={{ flex: 0.5 }} onSubmit={handleSubmit(onSubmit)}>
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
                  <PhoneInput
                    id="phone-input"
                    fieldName="PhoneNumber"
                    error={errors.PhoneNumber}
                    register={register}
                    setValue={setValue}
                    getPhoneDataCallback={getPhoneDataCallback.current}
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
                  <TextInput
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
                <Button
                  className=" btn-secondary mt-20"
                  type="submit"
                  disabled={
                    (isPhoneDirty.current === false && !formState.isDirty) ||
                    !formState.isValid ||
                    formState.isSubmitting ||
                    isLoading
                  }
                >
                  {t("BUTTONS.UPDATE")}
                </Button>
              </Box>
            </form>
          </Box>
          <Box
            sx={{
              display: tabValue === 1 ? "flex" : "none",
              flexDirection: { xs: "column", md: "row" },
              gap: "2.5rem",
            }}
            className={`account_form ${tabValue === 1 ? "active" : ""} `}
          >
            <Box sx={{ flex: 1 }}>
              <PasswordsFormComponent isLoading={isLoading} />
            </Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1 }}>
              <Box
                sx={{ display: { sm: "block", md: "block" } }}
                className="account_form_row MFA"
              >
                {!isLoading ? (
                  <MFAControlComponent
                    //{...register("DefaultMFA")}
                    defaultValue={watch("DefaultMFA")} // Add this line
                    onChange={handleMfaChange}
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
      <PasswordConfirmPopupComponent
        open={showPasswordPopup}
        onClose={() => setShowPasswordPopup(false)}
        onConfirm={handlePasswordConfirmed}
      />
      <OTPConfirmPopupComponent
        isChecked={getValues().PhoneNumberConfirmed}
        open={showOtpPopup && !getValues().PhoneNumberConfirmed}
        onClose={() => {
          setShowOtpPopup(false);
          setPendingPassword("");
        }}
        onSendOtp={() =>
          smsRequest({
            PhoneNumber: getValues().PhoneNumber,
            UserId: user?.customerNo || "",
            Password: pendingPassword || undefined,
          })
        }
        onConfirm={(otp) =>
          smsConfirm({ code: otp, userId: user?.customerNo || "" })
        }
        type="SMS"
      />
      <OTPConfirmPopupComponent
        isChecked={getValues().EmailConfirmed}
        onClose={() => {
          setShowOtpPopup(false);
          setPendingPassword("");
        }}
        onSendOtp={() =>
          emailRequest({
            EmailId: getValues().EmailId,
            UserId: user?.customerNo || "",
            Password: pendingPassword || undefined,
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
