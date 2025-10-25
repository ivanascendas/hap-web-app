import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@shared/redux/slices/authSlice";
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
  RefundDocumentType,
} from "@shared/dtos/refund.dtos";
import { toast } from "react-toastify";
import "./RefundForm.component.scss";
import { RefundFormComponent } from "./RefundForm.component";
export type RefundFormProps = {} & CreateRefundApplicationRequest;

interface RefundFormData extends CreateRefundApplicationRequest {
  phoneInput?: string;
}

/**
 * RefundFormPage component for creating new refund applications
 */
export const RefundFormPage = (): JSX.Element => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const navigate = useNavigate();

  const iniTelRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [createApplication, { isLoading: isCreating }] =
    useCreateApplicationMutation();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();

  const { handleSubmit, register, reset, control, setValue, formState } =
    useForm<RefundFormData>({
      mode: "all",
      defaultValues: {
        tenantId: user?.customerNo || "",
        applicantName: user?.customerName || "",
        address: user?.address || "",
        trnPpsn: "",
        email: user?.email || "",
        phone: user?.phone ? `+${user.phone}` : "",
        refundReason: ``,
        currency: "EUR",
        amount: 50,
        referenceCode: "",
        submissionChannel: "portal",
        jointTenancy: false,
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
        address: user?.address || "",
        trnPpsn: "",
        email: user?.email || "",
        phone: user?.phone ? `+${user.phone}` : "",
        refundReason: "",
        currency: "EUR",
        amount: process.env.REACT_APP_REFUND_MIN_AMOUNT
          ? Number(process.env.REACT_APP_REFUND_MIN_AMOUNT)
          : 50,
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

      toast.success(t("REFUNDS.FORM.SUCCESS_MESSAGE"));

      // Upload documents if any
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          await uploadDocument({
            applicationId: result.applicationId,
            documentType: RefundDocumentType.BankHeader,
            file,
          }).unwrap();
        }
      }

      // Navigate to the refund details page
      navigate(`/refunds/${result.applicationId}`);
    } catch (error) {
      console.error("Error creating refund application:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        t("ERRORS.SERVER_ERROR");
      toast.error(errorMessage);
    }
  };

  return (
    <RefundFormComponent
      title={t("REFUNDS.FORM.TITLE")}
      handleSubmit={handleSubmit(onSubmit)}
      register={register}
      control={control}
      formState={formState}
      setValue={setValue}
      isCreating={isCreating}
      isUploading={isUploading}
      selectedFiles={selectedFiles}
      setSelectedFiles={setSelectedFiles}
      iniTelRef={iniTelRef}
    />
  );
};
