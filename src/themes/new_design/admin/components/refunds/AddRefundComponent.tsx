import React, { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  useMediaQuery,
  Autocomplete,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@shared/redux/slices/authSlice";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import {
  Controller,
  UseFormRegister,
  FormState,
  Control,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IntlTelInputComponent } from "@shared/components/IntlTelInput.component";
import {
  CreateRefundApplicationRequest,
  PaymentMethod,
} from "@shared/dtos/refund.dtos";
import "./RefundForm.component.scss";
import { isValid } from "date-fns";
import { title } from "process";

import { toast } from "react-toastify";
import { useCreateApplicationMutation } from "@shared/services/Refunds.service";
import { selectUserLoading } from "@shared/redux/slices/loaderSlice";
import { useLazyGetCustomersQuery } from "@shared/services/Customers.service";
import { CustomerDto } from "@shared/dtos/customer.dtos";
import { useConfig } from "@shared/providers/Configuration.provider";
export type RefundFormProps = {
  title: string;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<RefundFormData>;
  formState: FormState<RefundFormData>;
  control: Control<RefundFormData>;
  setValue: UseFormSetValue<RefundFormData>;
  isCreating: boolean;
  isUploading: boolean;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;

  selectedLopFiles: File[];
  setSelectedLopFiles: React.Dispatch<React.SetStateAction<File[]>>;
  iniTelRef: React.RefObject<HTMLInputElement>;
};

interface RefundFormData extends CreateRefundApplicationRequest {
  phoneInput?: string;
}

/**
 * RefundFormComponent for creating new refund applications
 */
export const AddRefundComponent = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { config } = useConfig();

  const isLoading = useSelector(selectUserLoading);
  const [createApplication, { isLoading: isCreating }] =
    useCreateApplicationMutation();
  const iniTelRef = useRef<HTMLInputElement>(null);

  // Customer autocomplete state
  const [
    getCustomers,
    { data: customersData, isFetching: isFetchingCustomers },
  ] = useLazyGetCustomersQuery();
  const [customerOptions, setCustomerOptions] = React.useState<CustomerDto[]>(
    [],
  );
  const [customerInputValue, setCustomerInputValue] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<CustomerDto | null>(null);

  // Screen size detection
  const isMobile = useMediaQuery("(max-width:768px)");

  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<RefundFormData>({
    mode: "all",
    defaultValues: {
      tenantId: user?.customerNo || "",
      applicantName: user?.customerName || "",
      address: user?.address?.replace(/\s\s+/g, "\n") || "",
      trnPpsn: "",
      email: user?.email || "",
      phone: user?.phone ? `+${user.phone}` : "",
      refundReason: ``,
      currency: "EUR",
      amount: config?.refundMinAmount || 50,
      referenceCode: "",
      submissionChannel: "portal",
      jointTenancy: false,
      paymentMethod: PaymentMethod.EFT,
      iban: "",
      bic: "",
      dueBy: "",
    },
  });

  const validatePPSN = (ppsn: string): boolean => {
    // Normalize input: remove spaces and make uppercase
    ppsn = ppsn.trim().toUpperCase();

    // Match PPSN format:
    // - Old format: 7 digits + 1 letter (e.g. 1234567T)
    // - New format: 7 digits + 2 letters (e.g. 1234567TW)
    const ppsnPattern = /^(\d{7})([A-Z]{1,2})$/;
    const match = ppsn.match(ppsnPattern);
    if (!match) return false;

    const digits = match[1];
    const letters = match[2];

    // Weighted checksum calculation (for first letter only)
    const multipliers = [8, 7, 6, 5, 4, 3, 2];
    let total = 0;

    for (let i = 0; i < 7; i++) {
      total += parseInt(digits[i], 10) * multipliers[i];
    }

    // If there is a 2nd letter (new format), include it in the checksum
    if (letters.length === 2) {
      const secondLetterValue = letters.charCodeAt(1) - 64; // A=1, B=2, etc.
      total += secondLetterValue * 9;
    }

    const remainder = total % 23;
    const checkChar =
      remainder === 0 ? "W" : String.fromCharCode(64 + remainder);

    // Compare calculated check character with the first letter
    return letters[0] === checkChar;
  };

  const handleCancel = () => {
    navigate("/refunds");
  };

  useEffect(() => {
    if (!isLoading && user) {
      reset({
        tenantId: user?.customerNo || "",
        applicantName: user?.customerName || "",
        address: user?.address?.replace(/\s\s+/g, "\n") || "",
        trnPpsn: "",
        email: user?.email || "",
        phone: user?.phone ? `+${user.phone}` : "",
        refundReason: "",
        currency: "EUR",
        amount: config?.refundMinAmount || 50,
        referenceCode: "",
        submissionChannel: "portal",
        jointTenancy: false,
        paymentMethod: PaymentMethod.EFT,
        iban: "",
        bic: "",
        dueBy: "",
      });
      if (iniTelRef.current && user.phone) {
        iniTelRef.current.value = `+${user.phone}`;
      }
    }
  }, [user, isLoading, reset]);

  // Fetch customers when input changes
  useEffect(() => {
    if (customerInputValue.length >= 2) {
      getCustomers({
        $filter: `substringof('${customerInputValue}',CustomerName) or substringof('${customerInputValue}',CustomerNumber)`,
        incDepts: "All",
        $count: true,
        $orderby: "CustomerName asc",
        $skip: 0,
        $top: 20,
      });
    }
  }, [customerInputValue, getCustomers]);

  // Update customer options when data changes
  useEffect(() => {
    if (customersData?.items) {
      setCustomerOptions(customersData.items);
    }
  }, [customersData]);

  const onSubmit = async (data: RefundFormData) => {
    try {
      // Get phone number from the input field
      const fullPhone = iniTelRef.current?.value || data.phone;

      const requestData: CreateRefundApplicationRequest = {
        ...data,
        phone: fullPhone,
      };

      // Create the refund application
      await createApplication(requestData).unwrap();

      toast.success(t("REFUNDS.FORM.SUCCESS_MESSAGE"));

      // Navigate to the refund details page
      // navigate(`/refunds/${result.applicationId}`);
    } catch (error) {
      console.error("Error creating refund application:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        t("ERRORS.SERVER_ERROR");
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      className={`refund-form-container personal_box personal_box_content ${isMobile ? "refund-form-container--mobile" : ""}`}
      sx={{ margin: isMobile ? "0.5rem" : "1.5rem" }}
    >
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {t("REFUNDS.FORM.DESCRIPTION")}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="refund-form">
        <Grid container spacing={isMobile ? 2 : 3}>
          {/* Tenant ID */}
          <Grid size={12}>
            <Controller
              name="tenantId"
              control={control}
              rules={{ required: t("ERRORS.REQUIRED") }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  fullWidth
                  options={customerOptions}
                  getOptionLabel={(option) =>
                    typeof option === "string"
                      ? option
                      : `${option.customerNumber} - ${option.customerName}`
                  }
                  loading={isFetchingCustomers}
                  value={
                    selectedCustomer ||
                    customerOptions.find(
                      (c) => c.customerNumber.toString() === value,
                    ) ||
                    null
                  }
                  onChange={(_, newValue) => {
                    setSelectedCustomer(newValue);
                    onChange(newValue?.customerNumber.toString() || "");
                    if (newValue) {
                      setValue("applicantName", newValue.customerName);
                      setValue("address", newValue.address);
                      setValue("email", newValue.email);
                      setValue(
                        "phone",
                        newValue.phoneNumber ? `+${newValue.phoneNumber}` : "",
                      );
                      if (iniTelRef.current && newValue.phoneNumber) {
                        iniTelRef.current.value = `+${newValue.phoneNumber}`;
                      }
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setCustomerInputValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("REFUNDS.FORM.TENANT_ID")}
                      error={!!errors.tenantId}
                      helperText={errors.tenantId?.message}
                      placeholder={
                        t("REFUNDS.FORM.TENANT_ID_PLACEHOLDER") ||
                        "Type to search..."
                      }
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Applicant Name */}
          <Grid size={12}>
            <TextField
              fullWidth
              label={t("REFUNDS.FORM.APPLICANT_NAME")}
              {...register("applicantName", {
                required: t("ERRORS.REQUIRED"),
              })}
              error={!!errors.applicantName}
              helperText={errors.applicantName?.message}
            />
          </Grid>
          {/* Address */}
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("REFUNDS.FORM.ADDRESS")}
              {...register("address", {
                required: t("ERRORS.REQUIRED"),
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          {/* TRN/PPSN */}
          <Grid size={12}>
            <TextField
              fullWidth
              label={t("REFUNDS.FORM.TRN_PPSN")}
              {...register("trnPpsn", {
                required: t("ERRORS.REQUIRED"),
                validate: (value) =>
                  validatePPSN(value) || t("ERRORS.INVALID_PPSN"),
              })}
              error={!!errors.trnPpsn}
              helperText={errors.trnPpsn?.message}
            />
          </Grid>

          {/* Contact Information */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {t("REFUNDS.FORM.CONTACT_INFO")}
            </Typography>
          </Grid>

          <Grid size={isMobile ? 12 : 6}>
            <TextField
              fullWidth
              type="email"
              label={t("REFUNDS.FORM.EMAIL")}
              {...register("email", {
                required: t("ERRORS.REQUIRED"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("ERRORS.EMAIL"),
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid size={isMobile ? 12 : 6}>
            <IntlTelInputComponent
              ref={iniTelRef}
              defaultValue={user ? `+${user.phone}` : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue("phone", e.target.value);
              }}
            />
          </Grid>

          {/* Refund Details */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {t("REFUNDS.FORM.REFUND_DETAILS")}
            </Typography>
          </Grid>

          {/* Refund Reason */}
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("REFUNDS.FORM.REFUND_REASON")}
              {...register("refundReason", {
                required: t("ERRORS.REQUIRED"),
                minLength: {
                  value: 10,
                  message: t("ERRORS.TOO_SHORT"),
                },
              })}
              error={!!errors.refundReason}
              helperText={errors.refundReason?.message}
            />
          </Grid>

          {/* Amount and Currency */}
          <Grid size={isMobile ? 12 : 6}>
            <TextField
              fullWidth
              type="number"
              label={t("REFUNDS.FORM.AMOUNT")}
              {...register("amount", {
                required: t("ERRORS.AMOUNT_REQUIRED_FIELD"),
                min: { value: 0.01, message: t("ERRORS.INVALID_NUMBER") },
              })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              InputProps={{
                startAdornment: <Typography>€</Typography>,
              }}
            />
          </Grid>

          <Grid size={isMobile ? 12 : 6}>
            <Alert severity="info" sx={{ mt: isMobile ? 0 : -0.5 }}>
              {t("REFUNDS.FORM.MIN_AMOUNT_NOTICE", {
                amount: config?.refundMinAmount || 50,
              })}
            </Alert>
          </Grid>

          {/* Joint Tenancy */}
          <Grid size={12} sx={{ display: "none" }}>
            <FormControl fullWidth>
              <Controller
                name="jointTenancy"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label={t("REFUNDS.FORM.JOINT_TENANCY")}
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Payment Information */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {t("REFUNDS.FORM.PAYMENT_INFO")}
            </Typography>
          </Grid>

          {/* IBAN */}
          <Grid size={12}>
            <TextField
              fullWidth
              label={t("REFUNDS.FORM.IBAN")}
              {...register("iban", {
                required: t("ERRORS.REQUIRED"),
                pattern: {
                  value: /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/,
                  message: t("ERRORS.INVALID_IBAN"),
                },
              })}
              error={!!errors.iban}
              helperText={errors.iban?.message}
            />
          </Grid>

          {/* BIC */}
          <Grid size={12}>
            <TextField
              fullWidth
              label={t("REFUNDS.FORM.BIC")}
              {...register("bic", {
                required: t("ERRORS.REQUIRED"),
                pattern: {
                  value: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
                  message: t("ERRORS.INVALID_BIC"),
                },
              })}
              error={!!errors.bic}
              helperText={errors.bic?.message}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid size={12}>
            <Box
              display="flex"
              flexDirection={isMobile ? "column-reverse" : "row"}
              justifyContent="space-between"
              mt={3}
              gap={isMobile ? 2 : 0}
            >
              <Button
                variant="outlined"
                startIcon={<WestIcon />}
                onClick={handleCancel}
                disabled={isCreating}
                fullWidth={isMobile}
              >
                {t("REFUNDS.FORM.CANCEL")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<EastIcon />}
                disabled={!isValid || isCreating}
                fullWidth={isMobile}
              >
                {isCreating
                  ? t("REFUNDS.FORM.SUBMITTING")
                  : t("REFUNDS.FORM.SUBMIT")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
