import React, { useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Grid,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import {
  useActivateCustomerMutation,
  useDeactivateCustomerMutation,
  useLazyGetCustomerQuery,
  useResetCustomerPasswordMutation,
  useUpdateCustomerMutation,
} from "@shared/services/Customers.service";
import "./user-details.modal.scss";
import { NotificationComponent } from "@shared/components/Notification.component";
import { useForm, Controller } from "react-hook-form";
import { CustomerDto, CustomerUpdateDto } from "@shared/dtos/customer.dtos";
import { IntlTelInputComponent } from "@shared/components/IntlTelInput.component";
import { Iti } from "intl-tel-input";
import { IntlTelInputRef } from "intl-tel-input/react";
import { getErrorMessage } from "@shared/utils/getErrorMessage";
import { setNotify } from "@shared/redux/slices/notifySlice";
import { useDispatch } from "react-redux";
import { Close as CloseIcon, Label } from "@mui/icons-material";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: utils } = require("intl-tel-input/build/js/utils.js");

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const { t } = useTranslation();
  const iniTelReff = useRef<IntlTelInputRef>();
  const iniTelinst = useRef<Iti>();
  const [fetchCustomer, { data: customer, isLoading }] =
    useLazyGetCustomerQuery();
  const [updateCustomer, { isSuccess: isUpdateUserSuccess }] =
    useUpdateCustomerMutation();
  const [resetCustomerPassword, { isSuccess: isResetPasswordSuccess }] =
    useResetCustomerPasswordMutation();
  const [activateCustomer] = useActivateCustomerMutation();
  const [deactivateCustomer] = useDeactivateCustomerMutation();
  const dispatch = useDispatch();

  const {
    register,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<CustomerDto>({
    defaultValues: {
      customerName: "",
      address: "",
      drNumber: "",
      email: "",
      phoneNumber: "",
      isActive: false,
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        ...customer,
        address: customer.address.replace(/\s\s+/g, "\n") || "",
        isActive: customer.lockoutEndDateUtc == null,
      });
      iniTelReff.current?.getInstance()?.setNumber(`+${customer.phoneNumber}`);
      console.log("customer", customer);
    }
  }, [customer, reset]);

  useEffect(() => {
    if (isOpen && userId) {
      console.log("Fetching customer data for userId:", userId);
      fetchCustomer(userId);
    }
  }, [isOpen, userId, fetchCustomer]);

  useEffect(() => {
    if (isUpdateUserSuccess) {
      dispatch(
        setNotify({ message: "MESSAGES.SUCCESS_DATA_UPDATED", duration: 3000 }),
      );
    }
  }, [isUpdateUserSuccess]);

  useEffect(() => {
    if (isResetPasswordSuccess) {
      dispatch(
        setNotify({
          message: "MESSAGES.SUCCESS_RESET_PASSWORD",
          duration: 3000,
        }),
      );
    }
  }, [isResetPasswordSuccess]);

  const handleUpdate = async () => {
    const values = getValues();
    const customerUpdate: Partial<CustomerUpdateDto> = {
      customerNumber: customer?.customerNumber,
    };
    if (values.email !== customer?.email) {
      customerUpdate.Email = values.email;
    }
    if (values.phoneNumber !== customer?.phoneNumber) {
      customerUpdate.PhoneNumber = values.phoneNumber;
    }
    try {
      if (
        values.isActive !== !customer?.lockoutEnabled &&
        customerUpdate.customerNumber
      ) {
        console.log(
          `Customer status changed: ${values.isActive} from ${customer?.lockoutEnabled}`,
        );

        customerUpdate.isActive = values.isActive;
        if (values.isActive) {
          await activateCustomer(customerUpdate.customerNumber.toString());
        } else {
          await deactivateCustomer(customerUpdate.customerNumber.toString());
        }
      }

      await updateCustomer(customerUpdate);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleResetPassword = async () => {
    console.log("handleResetPassword");
    try {
      await resetCustomerPassword(getValues("customerNumber").toString());
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log(getValues());

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="user-details-modal">
        <Typography variant="h6" component="h2">
          {t("POPUPS.USER_DETAILS.TITLE")}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>
        {isLoading ? (
          <div className="user-details-modal__loading">
            <CircularProgress />
          </div>
        ) : (
          <div className="user-details-modal__content">
            <Grid container spacing={2} className="space-y-4">
              <Grid size={{ xs: 6 }}>
                <TextField
                  {...register("customerName")}
                  fullWidth
                  label={t("LABELS.CUSTOMER_NAME")}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  error={!!errors.customerName}
                  helperText={getErrorMessage(errors.customerName?.type)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  })}
                  fullWidth
                  label={t("LABELS.EMAIL")}
                  slotProps={{
                    input: {
                      //readOnly: true,
                    },
                  }}
                  error={!!errors.email}
                  helperText={getErrorMessage(errors.email?.type)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  {...register("phoneNumber", {
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
                  label={t("LABELS.PHONE")}
                  fullWidth
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
                          setValue("phoneNumber", phone);
                        },
                      },
                    },
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  error={!!errors.phoneNumber}
                  helperText={getErrorMessage(errors.phoneNumber?.type)}
                  variant="outlined"
                  margin="normal"
                  className="phone-input-field"
                />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <TextField
                  {...register("customerNumber")}
                  fullWidth
                  label={t("ACCOUNT.CUSTOMER_NUMBER")}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  error={!!errors.customerNumber}
                  helperText={getErrorMessage(errors.customerNumber?.type)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <TextField
                  {...register("drNumber")}
                  fullWidth
                  label={t("LABELS.DR_NUMBER")}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  error={!!errors.drNumber}
                  helperText={getErrorMessage(errors.drNumber?.type)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register("address")}
                  fullWidth
                  label={t("LABELS.ADDRESS")}
                  slotProps={{
                    input: {
                      // readOnly: true,
                    },
                  }}
                  error={!!errors.address}
                  helperText={getErrorMessage(errors.address?.type)}
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    sx={{ margin: 0 }}
                    value={field.value ? "active" : "inactive"}
                    onChange={(e) =>
                      field.onChange(e.target.value === "active")
                    }
                  >
                    <FormControlLabel
                      value="active"
                      control={<Radio />}
                      label={t("LABELS.ACTIVE")}
                    />
                    <FormControlLabel
                      value="inactive"
                      control={<Radio />}
                      label={t("LABELS.CLOSED")}
                    />
                  </RadioGroup>
                )}
              />
            </Grid>
            <Box className="user-details-modal__buttons">
              <Button onClick={handleUpdate}>{t("BUTTONS.UPDATE")}</Button>
              <Button onClick={handleResetPassword} className="reset-password">
                {t("FORGOT_PASSWORD.TITLE")}
              </Button>
            </Box>
          </div>
        )}
      </Box>
    </Modal>
  );
};
