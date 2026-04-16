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
import "../../../refund/RefundForm.component.scss";
import { isValid } from "date-fns";

import { showToast } from "@shared/utils/showToast";
import { useCreateApplicationMutation } from "@shared/services/Refunds.service";
import { selectUserLoading } from "@shared/redux/slices/loaderSlice";
import {
  useLazyGetCustomerQuery,
  useLazyGetCustomersQuery,
} from "@shared/services/Customers.service";
import { CustomerDto } from "@shared/dtos/customer.dtos";
import { useConfig } from "@shared/providers/Configuration.provider";
import { validatePPSN } from "@shared/utils/validation.utils";
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
  const [getCustomer, { data: customer, isFetching: isFetchingCustomer }] =
    useLazyGetCustomerQuery();
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
    watch,
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
  // Watch form values to properly handle MUI label shrinking
  const applicantName = watch("applicantName");
  const address = watch("address");
  const email = watch("email");

  const handleCancel = () => {
    navigate("/admin/refunds");
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

  useEffect(() => {
    if (customer) {
      // setSelectedCustomer(customer);
      setValue("applicantName", customer.customerName, {
        shouldValidate: true,
      });
      setValue("address", customer.address?.replace(/\s\s+/g, "\n"), {
        shouldValidate: true,
      });
      setValue("email", customer.email, { shouldValidate: true });
      setValue("phone", customer.phoneNumber ? `+${customer.phoneNumber}` : "");
      if (iniTelRef.current && customer.phoneNumber) {
        iniTelRef.current.value = `+${customer.phoneNumber}`;
      }
    }
  }, [customer, setValue]);

  useEffect(() => {
    if (selectedCustomer) {
      getCustomer(selectedCustomer.userName.toString());
    }
  }, [selectedCustomer, getCustomer]);

  const onSubmit = async (data: RefundFormData) => {
    try {
      // Get phone number from the input field
      const fullPhone = iniTelRef.current?.value || data.phone;

      const requestData: CreateRefundApplicationRequest = {
        ...data,
        phone: fullPhone,
      };

      // Create the refund application
      const result = await createApplication(requestData).unwrap();

      showToast("success", t("REFUNDS.FORM.SUCCESS_MESSAGE"));

      // Navigate to the refund details page
      navigate(`/admin/refunds/${result.applicationId}`);
    } catch (error) {
      console.error("Error creating refund application:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        (error as { data?: { detail?: string } })?.data?.detail ||
        t("ERRORS.SERVER_ERROR");
      showToast("error", errorMessage);
    }
  };

  return (
    <Box sx={{ pt: 3, pb: 3 }}>
      <Box
        className={`refund-form-container personal_box personal_box_content ${isMobile ? "refund-form-container--mobile" : ""}`}
        sx={{ margin: isMobile ? "0.5rem" : "1.5rem", m: 4 }}
      >
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          {t("REFUNDS.FORM.TITLE")}
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
                        : `${option.userName} - ${option.cust_name}`
                    }
                    loading={isFetchingCustomers}
                    value={
                      selectedCustomer ||
                      customerOptions.find(
                        (c) => c.userName.toString() === value,
                      ) ||
                      null
                    }
                    onChange={(_, newValue) => {
                      setSelectedCustomer(newValue);
                      onChange(newValue?.userName.toString() || "");
                      if (newValue) {
                        setValue("applicantName", newValue.cust_name, {
                          shouldValidate: true,
                        });
                        setValue("address", newValue.address, {
                          shouldValidate: true,
                        });
                        /* setValue('email', newValue.email, { shouldValidate: true });
                        setValue(
                          'phone',
                          newValue.phoneNumber ? `+${newValue.phoneNumber}` : ''
                        );
                        if (iniTelRef.current && newValue.phoneNumber) {
                          iniTelRef.current.value = `+${newValue.phoneNumber}`;
                        }*/
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
                InputLabelProps={{ shrink: !!applicantName }}
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
                InputLabelProps={{ shrink: !!address }}
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
                InputLabelProps={{ shrink: !!email }}
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
    </Box>
  );
};
