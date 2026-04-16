import React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectBalance, selectUser } from "@shared/redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { selectUserLoading } from "@shared/redux/slices/loaderSlice";
import { useNavigate } from "react-router-dom";
import {
  useCreateApplicationMutation,
  useUploadDocumentMutation,
} from "@shared/services/Refunds.service";
import {
  CreateRefundApplicationRequest,
  PaymentMethod,
  RefundApplicationDto,
  RefundDocumentType,
} from "@shared/dtos/refund.dtos";
import { showToast } from "@shared/utils/showToast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import "./RefundForm.component.scss";
import { RefundFormComponent } from "./RefundForm.component";
import { useConfig } from "@shared/providers/Configuration.provider";
export type RefundFormProps = {} & CreateRefundApplicationRequest;

interface RefundFormData extends CreateRefundApplicationRequest {
  phoneInput?: string;
  movedHouse?: boolean;
}

/**
 * RefundFormPage component for creating new refund applications
 */
export const RefundFormPage = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const navigate = useNavigate();
  const { config } = useConfig();
  const balance = useSelector(selectBalance);
  const iniTelRef = useRef<HTMLInputElement>(null);
  const [isHeaderFilesUploaded, setIsHeaderFilesUploaded] = useState(false);
  const [isLopFilesUploaded, setIsLopFilesUploaded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedLopFiles, setSelectedLopFiles] = useState<File[]>([]);
  const [sendResult, setSendResult] = useState<RefundApplicationDto | null>(
    null,
  );
  const [lopSendingError, setLopSendingError] = useState<string | null>(null);
  const [headerSendingError, setHeaderSendingError] = useState<string | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createApplication, { isLoading: isCreating }] =
    useCreateApplicationMutation();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();

  const { handleSubmit, register, reset, control, setValue, formState, watch } =
    useForm<RefundFormData>({
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
        amount: balance?.closingBalance || 50,
        referenceCode: "",
        submissionChannel: "portal",
        jointTenancy: false,
        movedHouse: false,
        paymentMethod: PaymentMethod.EFT,
        iban: "",
        bic: "",
        dueBy: "",
      },
    });

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
        amount: balance?.closingBalance || config?.refundMinAmount || 50,
        referenceCode: "",
        submissionChannel: "portal",
        jointTenancy: false,
        movedHouse: false,
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

  const onSubmit = async (data: RefundFormData) => {
    try {
      // Get phone number from the input field
      const fullPhone = iniTelRef.current?.value || data.phone;

      const requestData: CreateRefundApplicationRequest = {
        ...data,
        phone: fullPhone,
        jointTenancy: selectedLopFiles.length > 0 ? true : data.jointTenancy,
      };

      if (selectedFiles.length === 0) {
        showToast("error", t("REFUNDS.FORM.ERROR_NO_DOCUMENTS"));
        return;
      }
      let result: RefundApplicationDto | null = null;
      if (sendResult === null) {
        // Create the refund application
        result = await createApplication(requestData).unwrap();
        setSendResult(result);
      } else {
        result = sendResult;
      }

      showToast("success", t("REFUNDS.FORM.SUCCESS_MESSAGE"));

      // Upload documents if any
      if (!isHeaderFilesUploaded && result && selectedFiles.length > 0) {
        try {
          for (const file of selectedFiles) {
            await uploadDocument({
              applicationId: result.applicationId,
              documentType: RefundDocumentType.BankHeader,
              file,
            }).unwrap();
          }
          setIsHeaderFilesUploaded(true);
        } catch (error) {
          setHeaderSendingError(
            (error as { data?: { message?: string } })?.data?.message ||
              (error as { data?: { detail?: string } })?.data?.detail ||
              t("ERRORS.SERVER_ERROR"),
          );
          throw error;
        }
      }

      // Upload LOP documents if any
      if (!isLopFilesUploaded && result && selectedLopFiles.length > 0) {
        try {
          for (const file of selectedLopFiles) {
            await uploadDocument({
              applicationId: result.applicationId,
              documentType: RefundDocumentType.PermissionLetter,
              file,
            }).unwrap();
          }
          setIsLopFilesUploaded(true);
        } catch (error) {
          setLopSendingError(
            (error as { data?: { message?: string } })?.data?.message ||
              (error as { data?: { detail?: string } })?.data?.detail ||
              t("ERRORS.SERVER_ERROR"),
          );
          throw error;
        }
      }

      // Show success modal instead of toast
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating refund application:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        t("ERRORS.SERVER_ERROR");
      showToast("error", errorMessage);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/refunds");
  };

  return (
    <>
      <RefundFormComponent
        title={t("REFUNDS.FORM.TITLE")}
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
        control={control}
        formState={formState}
        setValue={setValue}
        watch={watch}
        isCreating={isCreating}
        isUploading={isUploading}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        iniTelRef={iniTelRef}
        selectedLopFiles={selectedLopFiles}
        setSelectedLopFiles={setSelectedLopFiles}
        isHeaderFilesUploaded={isHeaderFilesUploaded}
        isLopFilesUploaded={isLopFilesUploaded}
        headerSendingError={headerSendingError}
        lopSendingError={lopSendingError}
      />

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={(event, reason) => {
          // Prevent closing by clicking outside or pressing ESC
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          handleSuccessModalClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            paddingTop: 4,
            paddingBottom: 2,
          }}
        >
          {t("REFUNDS.FORM.SUCCESS_TITLE")}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              {t("REFUNDS.FORM.SUCCESS_POPUP_MESSAGE")}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            paddingBottom: 3,
          }}
        >
          <Button
            onClick={handleSuccessModalClose}
            variant="contained"
            color="primary"
            size="large"
            sx={{
              minWidth: 120,
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
