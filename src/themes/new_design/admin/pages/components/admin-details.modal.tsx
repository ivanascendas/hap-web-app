import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Switch,
  Typography,
  FormGroup,
  Checkbox,
  Grid,
  IconButton,
  Alert,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { Close as CloseIcon } from "@mui/icons-material";
import { setNotify } from "@shared/redux/slices/notifySlice";
import { useDispatch } from "react-redux";
import {
  AdminDto,
  CreateAdminDto,
  UpdateAdminDto,
  UpdatePasswordByAdminDto,
  UserRoleName,
} from "@shared/dtos/admins.dtos";
import { useTranslation } from "react-i18next";
import { Iti } from "intl-tel-input";
import { IntlTelInputRef } from "intl-tel-input/react";
import { IntlTelInputComponent } from "@shared/components/IntlTelInput.component";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import { useLazyGetAdminDepartmentsQuery } from "@shared/services/Department.service";
import { useAuth } from "@shared/providers/Auth.provider";
import {
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminPasswordMutation,
} from "@shared/services/Admins.service";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: utils } = require("intl-tel-input/build/js/utils.js");

interface AdminDetailsModalProps {
  open: boolean;
  admin: AdminDto | null;
  onClose: () => void;
  onSave: () => void;
}

export const AdminDetailsModal: React.FC<AdminDetailsModalProps> = ({
  open,
  admin,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm<CreateAdminDto & UpdateAdminDto>();
  const roles: UserRoleName[] = [
    "Client",
    "Admin",
    "SuperAdmin",
    "Manager",
    "DMU_L1",
    "DMU_L2",
    "AP",
  ];
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const iniTelReff = useRef<IntlTelInputRef>();
  const iniTelinst = useRef<Iti>();

  const { isAuthenticated } = useAuth();
  const [fetchDepartments, { data: properties }] =
    useLazyGetAdminDepartmentsQuery();
  const [createAdmin, { isSuccess: isAdminSuccessfullyCreated }] =
    useCreateAdminMutation();
  const [
    updateAdmin,
    { isLoading: isUpdating, isSuccess: isAdminSuccessfullyUpdated },
  ] = useUpdateAdminMutation();
  const [updateAdminPassword, { isSuccess: isPasswordSuccessfullyUpdated }] =
    useUpdateAdminPasswordMutation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchDepartments();
    }
  }, [fetchDepartments, isAuthenticated]);

  useEffect(() => {
    if (admin) {
      reset({
        Id: admin.id,
        Email: admin.email,
        Phone: admin.phoneNumber,
        LockoutEnabled: admin.lockoutEnabled,
        TwoFactorEnabled: admin.twoFactorEnabled,
        IncDepts: admin.incDepts,
        UserName: admin.userName,
      });
      setTimeout(() => {
        iniTelReff.current?.getInstance()?.setNumber(`+${admin.phoneNumber}`);
      }, 100);
    } else {
      reset({
        Id: undefined,
        UserName: "",
        Email: "",
        Phone: "",
        TwoFactorEnabled: false,
        IncDepts: [],
      });
    }
  }, [admin, reset]);

  useEffect(() => {
    if (isAdminSuccessfullyCreated) {
      dispatch(
        setNotify({
          message: t("MESSAGES.ADMIN_CREATED"),
        }),
      );
    }
    if (isAdminSuccessfullyUpdated) {
      dispatch(
        setNotify({
          message: t("MESSAGES.INFO_UPDATED"),
        }),
      );
    }
    if (isPasswordSuccessfullyUpdated) {
      dispatch(
        setNotify({
          message: t("MESSAGES.PASSWORD_UPDATED"),
        }),
      );
    }
    if (
      isAdminSuccessfullyCreated ||
      isAdminSuccessfullyUpdated ||
      isPasswordSuccessfullyUpdated
    ) {
      setTimeout(() => onClose(), 1500);
    }
  }, [
    isAdminSuccessfullyCreated,
    isAdminSuccessfullyUpdated,
    isPasswordSuccessfullyUpdated,
  ]);

  const onSubmit = async (data: UpdateAdminDto & CreateAdminDto) => {
    if (admin) {
      await updateAdmin({
        Id: data.Id,
        Email: data.Email,
        Phone: data.Phone.replace("+", ""),
        TwoFactorEnabled: data.TwoFactorEnabled,
        LockoutEnabled: data.LockoutEnabled,
        IncDepts: data.IncDepts,
        Roles: data.Roles,
      });
    } else {
      await createAdmin({
        UserName: data.UserName,
        Email: data.Email,
        Phone: data.Phone.replace("+", ""),
        TwoFactorEnabled: data.TwoFactorEnabled,
        LockoutEnabled: data.LockoutEnabled,
        IncDepts: data.IncDepts,
        Password: data.Password,
        ConfirmPassword: data.ConfirmPassword,
        Roles: data.Roles,
      });
    }

    onSave();
  };

  const onSubmitUpdatePassword = async (data: UpdatePasswordByAdminDto) => {
    await updateAdminPassword({
      Id: data.Id,
      Password: data.Password,
      ConfirmPassword: data.ConfirmPassword,
    });

    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Box>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {t(
                admin
                  ? "POPUPS.ADMIN_DETAILS.TITLE"
                  : "POPUPS.CREATE_ADMIN.TITLE",
              )}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 16, right: 16 }}
            >
              <CloseIcon />
            </IconButton>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  required
                  label={t("POPUPS.ADMIN_DETAILS.LABELS.ADMIN_NAME")}
                  type="text"
                  {...register("UserName", {
                    required: "UserName is required",
                  })}
                  slotProps={{
                    input: {
                      readOnly: !!admin,
                    },
                  }}
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  required
                  label={t("POPUPS.ADMIN_DETAILS.LABELS.EMAIL")}
                  type="email"
                  {...register("Email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  {...register("Phone", {
                    required: true,
                    validate: (value) => {
                      const countryData = iniTelReff.current
                        ?.getInstance()
                        ?.getSelectedCountryData();
                      console.log({
                        Phone: value,
                        countryData,
                        error: utils.getValidationError(
                          value,
                          countryData?.iso2,
                        ),
                      });
                      const isValid = utils.isValidNumber(
                        value,
                        countryData?.iso2,
                      );

                      if (
                        utils.getValidationError(value, countryData?.iso2) ===
                          0 ||
                        isValid
                      ) {
                        return true;
                      } else {
                        return t("ERRORS.INVALID_PHONE");
                      }
                    },
                  })}
                  fullWidth
                  label={t("POPUPS.ADMIN_DETAILS.LABELS.PHONE")}
                  slotProps={{
                    input: {
                      inputComponent: IntlTelInputComponent,
                      inputProps: {
                        options: {
                          initialCountry: "ie",
                          separateDialCode: true,
                          formatOnDisplay: true,
                        },
                        getIti: (obj: IntlTelInputRef) => {
                          iniTelReff.current = obj;
                          iniTelinst.current = obj.getInstance() || undefined;
                        },
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const countryData =
                            iniTelinst.current?.getSelectedCountryData();
                          const phone = `+${countryData?.dialCode}${e.target.value}`;
                          setValue("Phone", phone);
                        },
                      },
                    },

                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  error={!!errors.Phone}
                  helperText={getErrorMessage(errors.Phone?.type)}
                  variant="outlined"
                  margin="normal"
                  className="phone-input-field"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box>
                  <Controller
                    name="LockoutEnabled"
                    control={control}
                    render={({ field }) => (
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        gap={2}
                        mb="1rem"
                      >
                        <FormLabel sx={{ flex: 3 }}>
                          {" "}
                          {t("POPUPS.ADMIN_DETAILS.LABELS.STATUS")}
                        </FormLabel>

                        <RadioGroup
                          {...field}
                          row
                          value={field.value ? "active" : "inactive"}
                          onChange={(e) =>
                            field.onChange(e.target.value === "active")
                          }
                        >
                          <FormControlLabel
                            value="active"
                            control={<Radio />}
                            label={t("POPUPS.ADMIN_DETAILS.STATUS.DISABLED")}
                          />
                          <FormControlLabel
                            value="inactive"
                            control={<Radio />}
                            label={t("POPUPS.ADMIN_DETAILS.STATUS.ENABLED")}
                          />
                        </RadioGroup>
                      </Box>
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Box sx={{ display: "flex" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {t("POPUPS.ADMIN_DETAILS.INCOME_DEPARTMENTS")}
                </Typography>

                <FormGroup className="income-departments">
                  <Controller
                    name="IncDepts"
                    control={control}
                    defaultValue={admin?.incDepts || []}
                    render={({ field }) => (
                      <>
                        {properties?.map(({ incDept }, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={field.value.includes(incDept)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, incDept]
                                    : field.value.filter(
                                        (dept: string) => dept !== incDept,
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={incDept}
                          />
                        ))}
                      </>
                    )}
                  />
                </FormGroup>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {t("POPUPS.ADMIN_DETAILS.ROLES")}
                </Typography>

                <FormGroup className="income-departments">
                  <Controller
                    name="Roles"
                    control={control}
                    defaultValue={admin?.roles || []}
                    render={({ field }) => (
                      <>
                        {roles?.map((role, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={field.value.includes(role)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, role]
                                    : field.value.filter(
                                        (dept: string) => dept !== role,
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={role}
                          />
                        ))}
                      </>
                    )}
                  />
                </FormGroup>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {t("LABELS.PASSWORD")}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box className="account_form_row">
                  <label
                    className=" required"
                    title={t("ACCOUNT.NEW_PASSWORD")}
                    htmlFor="account-new-password"
                    aria-label={t("ACCOUNT.NEW_PASSWORD")}
                  >
                    {t("ACCOUNT.NEW_PASSWORD")}
                  </label>

                  <TextField
                    id="account-new-password"
                    placeholder={t("ACCOUNT.NEW_PASSWORD")}
                    {...register("Password", {
                      required: !admin ? "Password is required" : false,
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type="password"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box className="account_form_row">
                  <label
                    className=" required"
                    title={t("ACCOUNT.CONFIRM_PASSWORD")}
                    htmlFor="account-confirm-password"
                    aria-label={t("ACCOUNT.CONFIRM_PASSWORD")}
                  >
                    {t("ACCOUNT.CONFIRM_PASSWORD")}
                  </label>

                  <TextField
                    id="account-confirm-password"
                    placeholder={t("ACCOUNT.CONFIRM_PASSWORD")}
                    {...register("ConfirmPassword", {
                      required: !admin ? "Password is required" : false,
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type="password"
                  />
                  {admin && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2, minWidth: "100%" }}
                      color="primary"
                      onClick={handleSubmit(onSubmitUpdatePassword)}
                    >
                      Change Password
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ marginLeft: "1rem" }}>
          <Controller
            name="TwoFactorEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label={t("MFA.TWO_FACTOR_AUTH")}
              />
            )}
          />
        </Box>
        {isAdminSuccessfullyCreated && (
          <Alert severity="success">{t("MESSAGES.ADMIN_CREATED")}</Alert>
        )}
        {isAdminSuccessfullyUpdated && (
          <Alert severity="success">{t("MESSAGES.INFO_UPDATED")}</Alert>
        )}
        {isPasswordSuccessfullyUpdated && (
          <Alert severity="success">{t("MESSAGES.PASSWORD_UPDATED")}</Alert>
        )}
        <Button
          variant="outlined"
          className="admin_outlined-button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          sx={{ marginRight: "1rem" }}
          className="admin_blue-button"
        >
          {t(admin ? "BUTTONS.UPDATE" : "BUTTONS.CREATE")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
