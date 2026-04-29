import React, { useState } from "react";
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
  UseFormWatch,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IntlTelInputComponent } from "@shared/components/IntlTelInput.component";
import { CreateRefundApplicationRequest } from "@shared/dtos/refund.dtos";
import {
  validateFiles,
  ALLOWED_EXTENSIONS,
} from "@shared/utils/fileValidation";
import "./RefundForm.component.scss";
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
  watch: UseFormWatch<RefundFormData>;
  iniTelRef: React.RefObject<HTMLInputElement>;
  isHeaderFilesUploaded?: boolean;
  isLopFilesUploaded?: boolean;
  headerSendingError?: string | null;
  lopSendingError?: string | null;
};

interface RefundFormData extends CreateRefundApplicationRequest {
  phoneInput?: string;
  movedHouse?: boolean;
}

/**
 * RefundFormComponent for creating new refund applications
 */
export const RefundFormComponent = ({
  register,
  handleSubmit,
  formState: { errors, isValid },
  control,
  setValue,
  isCreating,
  isUploading,
  selectedFiles,
  setSelectedFiles,
  selectedLopFiles,
  setSelectedLopFiles,
  isHeaderFilesUploaded,
  isLopFilesUploaded,
  headerSendingError,
  lopSendingError,
  watch,
  iniTelRef,
  title,
}: RefundFormProps): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { config } = useConfig();

  // Screen size detection
  const isMobile = useMediaQuery("(max-width:768px)");

  // File validation error state
  const [headerFileError, setHeaderFileError] = useState<string>("");
  const [lopFileError, setLopFileError] = useState<string>("");

  // Watch movedHouse checkbox to toggle address editability
  const movedHouse = watch("movedHouse");

  // Reset address to user's stored value when movedHouse is unchecked
  React.useEffect(() => {
    if (!movedHouse && user?.address) {
      setValue("address", user.address.replace(/\s\s+/g, "\n"));
    }
  }, [movedHouse, user, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const validationError = validateFiles(files);
      if (validationError) {
        setHeaderFileError(t(validationError.i18nKey));
        return;
      }
      setHeaderFileError("");
      setSelectedFiles(files);
    }
  };

  const handleLopFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const validationError = validateFiles(files);
      if (validationError) {
        setLopFileError(t(validationError.i18nKey));
        return;
      }
      setLopFileError("");
      setSelectedLopFiles(files);
    }
  };

  const handleCancel = () => {
    navigate("/refunds");
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

      <form onSubmit={handleSubmit} className="refund-form">
        <Grid container spacing={isMobile ? 2 : 3}>
          {/* Tenant ID */}
          <Grid size={12}>
            <TextField
              fullWidth
              required
              label={t("REFUNDS.FORM.TENANT_ID")}
              {...register("tenantId", {
                required: t("ERRORS.REQUIRED"),
              })}
              error={!!errors.tenantId}
              helperText={errors.tenantId?.message}
              disabled
            />
          </Grid>
          {/* Applicant Name */}
          <Grid size={12}>
            <TextField
              fullWidth
              required
              label={t("REFUNDS.FORM.APPLICANT_NAME")}
              {...register("applicantName", {
                required: t("ERRORS.REQUIRED"),
              })}
              error={!!errors.applicantName}
              helperText={errors.applicantName?.message}
            />
          </Grid>{" "}
          {/* Moved House */}
          <Grid size={12}>
            <FormControl fullWidth>
              <Controller
                name="movedHouse"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={!!value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label={t("REFUNDS.FORM.MOVED_HOUSE")}
                  />
                )}
              />
            </FormControl>
          </Grid>
          {/* Address */}
          <Grid size={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label={t("REFUNDS.FORM.ADDRESS")}
              {...register("address", {
                required: t("ERRORS.REQUIRED"),
                validate: (value) =>
                  /\S[\s\S]*\n[\s\S]*\S/.test(value ?? "") ||
                  t("ERRORS.ADDRESS_MIN_TWO_LINES"),
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
              disabled={!movedHouse}
            />
          </Grid>
          {/* TRN/PPSN 
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
          </Grid>*/}
          {/* Contact Information */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {t("REFUNDS.FORM.CONTACT_INFO")}
            </Typography>
          </Grid>
          <Grid size={isMobile ? 12 : 6}>
            <TextField
              fullWidth
              required
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
          {/* Refund Reason
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
          </Grid> */}
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
                readOnly: true,
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
              required
              label={t("REFUNDS.FORM.IBAN")}
              {...register("iban", {
                required: t("ERRORS.REQUIRED"),
                pattern: {
                  value: /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/,
                  message: t("ERRORS.INVALID_IBAN"),
                },
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              inputProps={{ style: { textTransform: "uppercase" } }}
              error={!!errors.iban}
              helperText={errors.iban?.message}
            />
          </Grid>
          {/* BIC */}
          <Grid size={12}>
            <TextField
              fullWidth
              required
              label={t("REFUNDS.FORM.BIC")}
              {...register("bic", {
                required: t("ERRORS.REQUIRED"),
                pattern: {
                  value: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
                  message: t("ERRORS.INVALID_BIC"),
                },
              })}
              inputProps={{ style: { textTransform: "uppercase" } }}
              error={!!errors.bic}
              helperText={errors.bic?.message}
            />
          </Grid>
          {/* Document Upload */}
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {t("REFUNDS.FORM.DOCUMENTS")}
              </Typography>
              {isHeaderFilesUploaded && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  {t("REFUNDS.FORM.DOCUMENTS_SUCCESSFULLY_UPLOADED")}
                </Alert>
              )}
              {headerSendingError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {headerSendingError}
                </Alert>
              )}
            </Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {t("REFUNDS.FORM.DOCUMENTS_DESCRIPTION")}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ flex: 1 }}>
                {t("REFUNDS.FORM.UPLOAD_DOCUMENTS")}
              </Typography>
              <input
                style={{ flex: 1, padding: 1, height: "auto" }}
                type="file"
                hidden
                accept={ALLOWED_EXTENSIONS}
                onChange={handleFileChange}
              />
            </Button>
            {headerFileError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {headerFileError}
              </Alert>
            )}
            {selectedFiles.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2">
                  {t("REFUNDS.FORM.SELECTED_FILES")}: {selectedFiles.length}
                </Typography>
                {selectedFiles.map((file, index) => (
                  <Typography key={index} variant="caption" display="block">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>
          {/* Document LOP Upload */}
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {t("REFUNDS.FORM.DOCUMENTS_LOP")}
              </Typography>
              {isLopFilesUploaded && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  {t("REFUNDS.FORM.DOCUMENTS_SUCCESSFULLY_UPLOADED")}
                </Alert>
              )}
              {lopSendingError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {lopSendingError}
                </Alert>
              )}
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
              dangerouslySetInnerHTML={{
                __html: t("REFUNDS.FORM.DOCUMENTS_LOP_DESCRIPTION"),
              }}
            ></Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ flex: 1 }}>
                {t("REFUNDS.FORM.UPLOAD_DOCUMENTS")}
              </Typography>
              <input
                style={{ flex: 1, padding: 1, height: "auto" }}
                type="file"
                hidden
                accept={ALLOWED_EXTENSIONS}
                disabled={isLopFilesUploaded}
                onChange={handleLopFileChange}
              />
            </Button>
            {lopFileError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {lopFileError}
              </Alert>
            )}
            {selectedFiles.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2">
                  {t("REFUNDS.FORM.SELECTED_FILES")}: {selectedLopFiles.length}
                </Typography>
                {selectedLopFiles.map((file, index) => (
                  <Typography key={index} variant="caption" display="block">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                ))}
              </Box>
            )}
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
                disabled={isCreating || isUploading}
                fullWidth={isMobile}
              >
                {t("REFUNDS.FORM.CANCEL")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<EastIcon />}
                disabled={!isValid || isCreating || isUploading}
                fullWidth={isMobile}
              >
                {isCreating || isUploading
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
