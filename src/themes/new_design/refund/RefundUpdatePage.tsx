import React from "react";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@shared/redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { selectUserLoading } from "@shared/redux/slices/loaderSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLazyGetApplicationByIdQuery,
  useSubmitApplicationMutation,
  useUploadDocumentMutation,
} from "@shared/services/Refunds.service";
import {
  CreateRefundApplicationRequest,
  PaymentMethod,
  RefundDocumentType,
  RefundStatus,
} from "@shared/dtos/refund.dtos";
import { toast } from "react-toastify";
import "./RefundForm.component.scss";
import { RefundFormComponent } from "./RefundForm.component";
export type RefundFormProps = {} & CreateRefundApplicationRequest;

interface RefundFormData extends CreateRefundApplicationRequest {
  phoneInput?: string;
}

/**
 * RefundUpdatePage component for updating existing refund applications
 */
export const RefundUpdatePage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const navigate = useNavigate();
  const [getApplication, { data }] = useLazyGetApplicationByIdQuery();
  const iniTelRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [submitApplication, { isLoading: isCreating }] =
    useSubmitApplicationMutation();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();

  const { handleSubmit, register, reset, control, setValue, formState } =
    useForm<RefundFormData>({
      mode: "all",
      defaultValues: {
        tenantId: data?.tenantId || user?.customerNo || "",
        applicantName: data?.applicantName || user?.customerName || "",
        address: data?.address || user?.address || "",
        trnPpsn: data?.trnPpsn || "",
        email: data?.email || user?.email || "",
        phone: data?.phone
          ? `+${data.phone}`
          : user?.phone
            ? `+${user.phone}`
            : "",
        refundReason: data?.refundReason || "",
        currency: data?.currency || "EUR",
        amount:
          data?.amount || process.env.REACT_APP_REFUND_MIN_AMOUNT
            ? Number(process.env.REACT_APP_REFUND_MIN_AMOUNT)
            : 50,
        referenceCode: data?.referenceCode || "",
        submissionChannel: data?.submissionChannel || "portal",
        jointTenancy: data?.jointTenancy || false,
        paymentMethod: data?.paymentMethod || PaymentMethod.EFT,
        iban: data?.iban || "",
        bic: data?.bic || "",
        dueBy: "",
      },
    });

  useEffect(() => {
    if (!isLoading && user) {
      getApplication(id || "");
      if (iniTelRef.current && user.phone) {
        iniTelRef.current.value = `+${user.phone}`;
      }
    }
  }, [user, isLoading, reset, getApplication, id]);
  useEffect(() => {
    if (data) {
      reset({
        tenantId: data?.tenantId || user?.customerNo || "",
        applicantName: data?.applicantName || user?.customerName || "",
        address: data?.address || user?.address || "",
        trnPpsn: data?.trnPpsn || "",
        email: data?.email || user?.email || "",
        phone: data?.phone ? `+${data.phone}` : "",
        refundReason: data?.refundReason || "",
        currency: data?.currency || "EUR",
        amount: data?.amount || 0,
        referenceCode: data?.referenceCode || "",
        submissionChannel: data?.submissionChannel || "portal",
        jointTenancy: data?.jointTenancy || false,
        paymentMethod: data?.paymentMethod || PaymentMethod.EFT,
        iban: data?.iban || "",
        bic: data?.bic || "",
        dueBy: "",
      });
    }
    console.log("Loaded refund application data:", data);
  }, [data, reset, user]);
  const onSubmit = async (data: RefundFormData) => {
    try {
      // Get phone number from the input field
      const fullPhone = iniTelRef.current?.value || data.phone;

      const requestData: CreateRefundApplicationRequest = {
        ...data,
        phone: fullPhone,
      };

      const result = await submitApplication({
        ...data,
        ...requestData,
        applicationId: id || "",
        customerName: "",
        status: RefundStatus.Submitted,
        bshVerified: false,
        dueBy: data.dueBy ? new Date(data.dueBy) : undefined,
      }).unwrap();

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
      title={t("REFUNDS.FORM.TITLE_UPDATE")}
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
