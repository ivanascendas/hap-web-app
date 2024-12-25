import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  TextField,
  FormHelperText,
  Skeleton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import "./ExistingTenantPopup.component.scss";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { IntlTelInputComponent } from "./IntlTelInput.component";
import { useForm } from "react-hook-form";
import { ExsistingTenantDto } from "../dtos/existing-tenant.dto";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../redux/slices/authSlice";
import { getErrorMessage } from "../utils/getErrorMessage";
import { selectUserLoading } from "../redux/slices/loaderSlice";
import { MFAMethod } from "../dtos/user.dto";
import { Iti } from "intl-tel-input";
import {
  useSaveUserDataMutation,
  usePhoneConfirmationRequestMutation,
  useEmailConfirmationRequestMutation,
  usePhoneConfirmationMutation,
  useEmailConfirmationMutation,
} from "../services/Auth.service";

import WestIcon from "@mui/icons-material/West";
import { VerificationInputComponent } from "./VerificationInput.component";
import { MFAControlComponent } from "../../features/account/compomnents/MFAControl.component";
import { IntlTelInputRef } from "intl-tel-input/react";
const { default: utils } = require("intl-tel-input/build/js/utils.js");

export type ExistingTenantPopupProps = {
  open: boolean;
  onClose: () => void;
};

export const ExistingTenantPopupComponent = ({
  open,
  onClose,
}: ExistingTenantPopupProps): JSX.Element => {
  const [step, setStep] = useState(1);
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const [agreetoSend, setAgreetoSend] = useState(false);
  const [updateUser, result] = useSaveUserDataMutation();
  const [smsRequest] = usePhoneConfirmationRequestMutation();
  const [emailRequest] = useEmailConfirmationRequestMutation();
  const [smsConfirm, smsConfirmResult] = usePhoneConfirmationMutation();
  const [emailConfirm, emailConfirmResult] = useEmailConfirmationMutation();
  const iniTelReff = useRef<IntlTelInputRef>();
  const iniTelinst = useRef<Iti>();
  // const [showOtpPopup, setShowOtpPopup] = useState(false);
  const isPhoneDirty = useRef<boolean>(false);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors, isValid },
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
      PhoneNumber: user ? `+${user?.phone?.replace("+", "")}` : "",
      PhoneNumberConfirmed: user?.phoneNumberConfirmed || false,
      EmailConfirmed: user?.emailConfirmed || false,
      DefaultMFA: user?.defaultMFA || "Email",
      PhoneCountryCode: user?.phoneCountryCode || "353",
      PhoneExcludingCountryCode:
        user?.phone
          ?.replace("+", "")
          .replace(user?.phoneCountryCode || "353", "") || "",
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
    const phone = PhoneNumber.replace("+", "").replace(
      countryData?.dialCode || "353",
      "",
    );
    const model: ExsistingTenantDto = {
      EmailId,
      PhoneNumber: `${countryData?.dialCode || "353"}${phone}`,
      PhoneCountryCode: countryData?.dialCode || "353",
      PhoneExcludingCountryCode: phone,
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
      console.log("updateUser", { model });
      return updateUser(model).then(() => {
        console.log({ model });
        reset(model, {
          keepValues: true,
          keepDirty: false,
          keepIsValid: false,
        });
      });
    } else {
      return Promise.reject(
        new Error("Please confirm your email and phone number to continue"),
      );
    }
  };

  useEffect(() => {
    if (!isLoading && user?.defaultMFA) {
      console.log({ user });
      const data: ExsistingTenantDto = {
        EmailConfirmed: user?.emailConfirmed || false,
        PhoneNumberConfirmed: user?.phoneNumberConfirmed || false,
        PhoneNumber: user ? `+${user?.phone?.replace("+", "")}` : "",
        EmailId: user?.email || "",
        DefaultMFA: user?.defaultMFA || "Email",
        PhoneCountryCode: user?.phoneCountryCode || "353",
        PhoneExcludingCountryCode:
          user?.phone?.replace(user?.phoneCountryCode || "353", "") || "",
      };

      reset(data);
      iniTelReff.current?.getInstance()?.setNumber(data.PhoneNumber);
      console.log("reset", { data });
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
    console.log({
      isPhoneNumberConfirmed,
      isEmailConfirmed,
      compares: [values.PhoneNumber, user?.phone, values.EmailId, user?.email],
    });
    setValue("PhoneNumberConfirmed", isPhoneNumberConfirmed);
    setValue("EmailConfirmed", isEmailConfirmed);
  }, [formState, user]);

  useEffect(() => {
    if (smsConfirmResult.isSuccess) {
      console.log({ smsConfirmResult });
      dispatch(
        setUser({
          phone: getValues("PhoneNumber").replace("+", ""),
          phoneNumberConfirmed: true,
        }),
      );
      setValue("PhoneNumberConfirmed", true);
    }
    if (emailConfirmResult.isSuccess) {
      dispatch(setUser({ email: getValues("EmailId"), emailConfirmed: true }));
      setValue("EmailConfirmed", true);
    }
  }, [smsConfirmResult.isSuccess, emailConfirmResult.isSuccess]);

  const handleSubmitForm = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    trigger();
    if (isValid) {
      handleSubmit(onSubmit)()
        .then(() => {
          console.log("submitted");
          onClose();
        })
        .catch((err) => {
          console.log({ err });
        });
    } else {
      console.log("not valid");
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-label={t("MFA.EXISTING_TENANT_TITLE")}
      aria-describedby="existing tenant modal description"
    >
      <Box
        className="popup existing_tenant_popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="existing_tenant_popup_header">
          <Typography id="modal-title" variant="h1" component="h1">
            {t("MFA.EXISTING_TENANT_TITLE")}
          </Typography>
          <Tooltip title={t("BUTTONS.CLOSE")}>
            <IconButton size="small" className="ripple" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {step == 1 && (
          <Box>
            <Box className="existing_tenant_popup_content">
              <Typography
                id="modal-description"
                variant="body1"
                component="span"
                className="tenant-info"
              >
                {t("MFA.EXISTING_TENANT_INFO", {
                  button: t("BUTTONS.CONTINUE"),
                })}
              </Typography>
              <form
                className="existing_tenant_popup_content_form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Box className="existing_tenant_popup_content_form_row">
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
                <Box className="existing_tenant_popup_content_form_row">
                  <label
                    className=" label-question required"
                    title={t("MESSAGES.REGISTRATION_PHONE_TOOLTIP")}
                    htmlFor="phone-input"
                    aria-label={t("LABELS.ENTER_PHONE")}
                  >
                    {t("LABELS.ENTER_PHONE")}
                  </label>
                  <Box>
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
                          let isValid = utils.isValidNumber(
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
                  </Box>
                  {isLoading && (
                    <Skeleton
                      width={"100%"}
                      height={" 2.625rem"}
                      variant="rounded"
                    />
                  )}
                </Box>
                <Box
                  className="existing_tenant_popup_content_form_row"
                  sx={{ marginTop: "0.9rem" }}
                >
                  <FormControlLabel
                    value={agreetoSend}
                    onChange={() => setAgreetoSend(!agreetoSend)}
                    required
                    control={<Checkbox />}
                    label={t("MFA.AGREE")}
                  />
                </Box>
              </form>
            </Box>
            <Box className="existing_tenant_popup_footer">
              <Button
                onClick={() => setStep(step + 1)}
                fullWidth
                variant="contained"
                disabled={!agreetoSend || !isValid}
                className="button-primary"
              >
                {t("BUTTONS.CONTINUE")}
              </Button>
            </Box>
          </Box>
        )}
        {step === 2 && (
          <Box>
            <Box className="existing_tenant_popup_content">
              <Typography
                id="modal-description"
                variant="body1"
                component="span"
                className="tenant-info"
              >
                {t("MFA.EXISTING_TENANT_INFO_2", {
                  button: t("BUTTONS.CONTINUE"),
                })}
              </Typography>
              <Box className="confirmation-block">
                <VerificationInputComponent
                  isChecked={smsConfirmResult.isSuccess}
                  type={"SMS"}
                  onSendOtp={() =>
                    smsRequest({
                      PhoneNumber: getValues().PhoneNumber,
                      UserId: user?.customerNo || "",
                    })
                  }
                  onConfirm={(otp) =>
                    smsConfirm({ code: otp, userId: user?.customerNo || "" })
                  }
                />
                <VerificationInputComponent
                  isChecked={emailConfirmResult.isSuccess}
                  type={"Email"}
                  onSendOtp={() =>
                    emailRequest({
                      EmailId: getValues().EmailId,
                      UserId: user?.customerNo || "",
                    })
                  }
                  onConfirm={(otp) =>
                    emailConfirm({ code: otp, userId: user?.customerNo || "" })
                  }
                />
              </Box>
            </Box>
            <Box className="existing_tenant_popup_footer">
              <Button
                onClick={() => setStep(step + 1)}
                fullWidth
                className="button-primary"
              >
                {t("BUTTONS.CONTINUE")}
              </Button>
              <Button
                onClick={() => setStep(step - 1)}
                fullWidth
                startIcon={<WestIcon />}
              >
                {t("BUTTONS.BACK")}
              </Button>
            </Box>
          </Box>
        )}
        {step == 3 && (
          <Box>
            <Box className="existing_tenant_popup_content">
              <Typography
                id="modal-description"
                variant="body1"
                component="strong"
                className="tenant-info"
              >
                {t("MFA.EXISTING_TENANT_INFO_3", {
                  button: t("BUTTONS.CONTINUE"),
                })}
              </Typography>
              <Box className="confirmation-block">
                <MFAControlComponent
                  row={true}
                  defaultValue={watch("DefaultMFA")} // Add this line
                  onChange={(e) => {
                    setValue("DefaultMFA", e.target.value, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                />
              </Box>
            </Box>
            <Box className="existing_tenant_popup_footer">
              <Button
                onClick={handleSubmitForm}
                fullWidth
                className="button-primary"
              >
                {t("BUTTONS.FINISH")}
              </Button>
              <Button
                onClick={() => setStep(step - 1)}
                fullWidth
                startIcon={<WestIcon />}
              >
                {t("BUTTONS.BACK")}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
