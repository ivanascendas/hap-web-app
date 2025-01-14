import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { setNotify } from "../../../../shared/redux/slices/notifySlice";
import { useDispatch } from "react-redux";
import { AdminDto } from "../../../../shared/dtos/admins.dtos";
import { useTranslation } from "react-i18next";
import { Iti } from "intl-tel-input";
import { IntlTelInputRef } from "intl-tel-input/react";
import { IntlTelInputComponent } from "../../../../shared/components/IntlTelInput.component";
import { getErrorMessage } from "../../../../shared/utils/getErrorMessage";
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
  } = useForm<AdminDto>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const iniTelReff = useRef<IntlTelInputRef>();
  const iniTelinst = useRef<Iti>();

  useEffect(() => {
    if (admin) {
      reset(admin);
      setTimeout(() => {
        iniTelReff.current?.getInstance()?.setNumber(`+${admin.phoneNumber}`);
      }, 100);
    } else {
      reset({
        userName: "",
        email: "",
        phoneNumber: "",
      });
    }
  }, [admin, reset]);

  const onSubmit = async (data: Partial<AdminDto>) => {
    console.log(data);
    if (admin) {
      // await AdminService.update(admin.id, data);
      dispatch(
        setNotify({
          message: "Administrator updated successfully",
          duration: 3000,
        }),
      );
    } else {
      //await AdminService.create(data);
      dispatch(
        setNotify({
          message: "Administrator created successfully",
          duration: 3000,
        }),
      );
    }
    onSave();
  };

  const handleDelete = async () => {
    if (!admin) return;

    // await AdminService.delete(admin.id);
    dispatch(
      setNotify({
        message: "Administrator deleted successfully",
        duration: 3000,
      }),
    );
    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {t(
            admin ? "POPUPS.ADMIN_DETAILS.TITLE" : "POPUPS.CREATE_ADMIN.TITLE",
          )}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label={t("POPUPS.ADMIN_DETAILS.LABELS.ADMIN_NAME")}
              {...register("userName", { required: "Name is required" })}
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
            <TextField
              label={t("POPUPS.ADMIN_DETAILS.LABELS.EMAIL")}
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("phoneNumber", {
                required: true,
                validate: (value) => {
                  const countryData = iniTelReff.current
                    ?.getInstance()
                    ?.getSelectedCountryData();
                  const isValid = utils.isValidNumber(value, countryData?.iso2);
                  if (isValid) {
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
                      setValue("phoneNumber", phone);
                    },
                  },
                },
              }}
              error={!!errors.phoneNumber}
              helperText={getErrorMessage(errors.phoneNumber?.type)}
              variant="outlined"
              margin="normal"
            />
            <Controller
              name="lockoutEnabled"
              control={control}
              render={({ field }) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={2}
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
        </DialogContent>
        <DialogActions>
          {admin && (
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              type="button"
            >
              Delete
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
