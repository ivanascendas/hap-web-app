import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  RefundApplicationDto,
  RefundApplicationQueryParams,
  RefundApplicationsResponse,
  CreateRefundApplicationRequest,
  UpdateRefundApplicationRequest,
  RefundDocumentDto,
  UploadRefundDocumentRequest,
  VerifyBshRequest,
  VerifyBshResponse,
  ApproveRefundRequest,
  RejectRefundRequest,
  GL07ReportRequest,
  GL07ReportResponse,
  AdminApplicationQueryParams,
  ApprovalActionRequest,
  RequestInfoRequest,
  CancelApplicationRequest,
  ApprovalActionResponse,
  RefundDocumentType,
  ConfirmDocumentStatusRequest,
  ConfirmDocumentStatusResponse,
  AssignRefundResponse,
  RedactDocumentRequest,
  RedactDocumentResponse,
  DocumentVersionDto,
} from "../dtos/refund.dtos";

/**
 * Helper function to get enum name as string
 */
const getRefundDocumentTypeName = (type: RefundDocumentType): string => {
  return RefundDocumentType[type];
};

/**
 * RTK Query API for managing refund applications
 */
export const refundsApi = createApi({
  reducerPath: "refundsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["RefundApplication", "RefundDocument"],
  endpoints: (builder) => ({
    /**
     * Get list of refund applications with filtering and pagination
     */
    getApplications: builder.query<
      RefundApplicationsResponse,
      RefundApplicationQueryParams
    >({
      query: (params) => ({
        url: "/api/refunds/applications/mine",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ applicationId }) => ({
                type: "RefundApplication" as const,
                id: applicationId,
              })),
              { type: "RefundApplication", id: "LIST" },
            ]
          : [{ type: "RefundApplication", id: "LIST" }],
    }),

    /**
     * Get single refund application by ID
     */
    getApplicationById: builder.query<RefundApplicationDto, string>({
      query: (id) => ({
        url: `/api/refunds/applications/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "RefundApplication", id }],
    }),

    /**
     * Create new refund application
     */
    createApplication: builder.mutation<
      RefundApplicationDto,
      CreateRefundApplicationRequest
    >({
      query: (data) => ({
        url: "/api/refunds/applications",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "RefundApplication", id: "LIST" }],
    }),

    /**
     * Update existing refund application (only for DRAFT status)
     */
    updateApplication: builder.mutation<
      RefundApplicationDto,
      UpdateRefundApplicationRequest
    >({
      query: ({ id, ...data }) => ({
        url: `/api/refunds/applications/${id}`,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RefundApplication", id },
        { type: "RefundApplication", id: "LIST" },
      ],
    }),

    /**
     * Delete refund application (only for DRAFT status)
     */
    deleteApplication: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/refunds/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "RefundApplication", id },
        { type: "RefundApplication", id: "LIST" },
      ],
    }),

    /**
     * Submit refund application for review
     */
    submitApplication: builder.mutation<
      RefundApplicationDto,
      RefundApplicationDto
    >({
      query: (data) => ({
        url: `/api/refunds/applications/${data.applicationId}/resubmit`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, app) => [
        { type: "RefundApplication", id: app.applicationId },
        { type: "RefundApplication", id: "LIST" },
      ],
    }),

    /**
     * Get documents for a refund application
     */
    getApplicationDocuments: builder.query<RefundDocumentDto[], string>({
      query: (applicationId) => ({
        url: `/api/refunds/applications/${applicationId}/documents`,
        method: "GET",
      }),
      providesTags: (result, error, applicationId) =>
        result
          ? [
              ...result.map(({ documentId }) => ({
                type: "RefundDocument" as const,
                documentId,
              })),
              { type: "RefundDocument", id: applicationId },
            ]
          : [{ type: "RefundDocument", id: applicationId }],
    }),

    /**
     * Upload document to refund application
     */
    uploadDocument: builder.mutation<
      RefundDocumentDto,
      UploadRefundDocumentRequest
    >({
      query: ({ applicationId, documentType, file }) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("DocType", getRefundDocumentTypeName(documentType));

        return {
          url: `/api/refunds/applications/${applicationId}/documents`,
          method: "POST",
          body: formData as unknown as Record<string, string>, // Type cast for RTK Query compatibility
        };
      },
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundDocument", id: applicationId },
        { type: "RefundApplication", id: applicationId },
      ],
    }),

    /**
     * Delete document from refund application
     */
    deleteDocument: builder.mutation<
      void,
      { applicationId: string; documentId: string }
    >({
      query: ({ applicationId, documentId }) => ({
        url: `/api/refunds/applications/${applicationId}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundDocument", id: applicationId },
        { type: "RefundApplication", id: applicationId },
      ],
    }),

    /**
     * Download document
     */
    downloadDocument: builder.query<
      Blob,
      { applicationId: string; documentId: string; versionId?: string }
    >({
      query: ({ applicationId, documentId, versionId }) => {
        const params = new URLSearchParams();
        if (versionId) params.set("versionId", versionId);
        const queryString = params.toString();

        return {
          url: `/api/refunds/applications/${applicationId}/documents/${documentId}/download${queryString ? `?${queryString}` : ""}`,
          method: "GET",
          responseType: "blob",
          responseHandler: async (response: Response) => {
            const blob = await response.blob();
            const contentDisposition = response.headers.get(
              "Content-Disposition",
            );
            let filename = `document_${documentId}`;

            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
              );
              if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, "");
              }
            }

            if (blob) {
              // Type assertion for IE11 compatibility
              const nav = window.navigator as Navigator & {
                msSaveOrOpenBlob?: (blob: Blob, filename: string) => void;
              };

              if (nav.msSaveOrOpenBlob) {
                nav.msSaveOrOpenBlob(blob, filename);
              } else {
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(a.href);
              }
            }
          },
        };
      },
    }),

    /**
     * Get document blob for viewing (without triggering download)
     */
    getDocumentBlob: builder.query<
      Blob,
      {
        applicationId: string;
        documentId: string;
        format?: "pdf" | "jpg";
        versionId?: string;
      }
    >({
      query: ({ applicationId, documentId, format, versionId }) => {
        const params = new URLSearchParams();
        if (format) params.set("format", format);
        if (versionId) params.set("versionId", versionId);
        const queryString = params.toString();
        return {
          url: `/api/refunds/applications/${applicationId}/documents/${documentId}/download${queryString ? `?${queryString}` : ""}`,
          method: "GET",
          responseType: "blob",
          responseHandler: async (response: Response) => {
            return await response.blob();
          },
        };
      },
    }),

    /**
     * Verify BSH certificate
     */
    verifyBsh: builder.mutation<VerifyBshResponse, VerifyBshRequest>({
      query: ({ applicationId, objectKey }) => ({
        url: `/api/refunds/applications/${applicationId}/verify-bsh`,
        method: "POST",
        body: JSON.stringify({ objectKey }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "LIST" },
      ],
    }),

    /**
     * Approve refund application (admin only)
     */
    approveApplication: builder.mutation<
      RefundApplicationDto,
      ApproveRefundRequest
    >({
      query: ({ applicationId, ...data }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/approve`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "LIST" },
      ],
    }),

    /**
     * Reject refund application (admin only)
     */
    rejectApplication: builder.mutation<
      RefundApplicationDto,
      RejectRefundRequest
    >({
      query: ({ applicationId, reason }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/reject`,
        method: "POST",
        body: JSON.stringify({ reason }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "LIST" },
      ],
    }),

    /**
     * Generate GL07 report (admin only)
     */
    generateGL07Report: builder.mutation<GL07ReportResponse, GL07ReportRequest>(
      {
        query: (data) => ({
          url: "/api/refunds/gl07/batches",
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      },
    ),

    /**
     * Download GL07 report (admin only)
     */
    downloadGL07Report: builder.query<Blob, string>({
      query: (reportId) => ({
        url: `/api/refunds/admin/reports/gl07/${reportId}/download`,
        method: "GET",
        responseType: "blob",
        responseHandler: async (response: Response) => {
          const blob = await response.blob();
          const filename = `GL07_Report_${reportId}.pdf`;

          if (blob) {
            // Type assertion for IE11 compatibility
            const nav = window.navigator as Navigator & {
              msSaveOrOpenBlob?: (blob: Blob, filename: string) => void;
            };

            if (nav.msSaveOrOpenBlob) {
              nav.msSaveOrOpenBlob(blob, filename);
            } else {
              const a = document.createElement("a");
              document.body.appendChild(a);
              a.href = window.URL.createObjectURL(blob);
              a.download = filename;
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(a.href);
            }
          }
        },
      }),
    }),

    /**
     * Get admin applications list with filtering and pagination
     */
    getAdminApplications: builder.query<
      RefundApplicationsResponse,
      AdminApplicationQueryParams
    >({
      query: (params) => ({
        url: "/api/refunds/admin/applications",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "RefundApplication", id: "ADMIN_LIST" },
              ...result.items.map(({ applicationId }) => ({
                type: "RefundApplication" as const,
                id: applicationId,
              })),
            ]
          : [{ type: "RefundApplication", id: "ADMIN_LIST" }],
    }),

    /**
     * Reassign refund application at admin
     */
    reassignApplications: builder.mutation<
      AssignRefundResponse,
      { applicationId: string; targetAdminId: string }
    >({
      query: ({ applicationId, targetAdminId }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/reassign`,
        method: "POST",
        body: JSON.stringify({ targetAdminId }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),
    /**
     * Assign refund application at admin
     */
    assignApplications: builder.mutation<
      AssignRefundResponse,
      { applicationId: string }
    >({
      query: ({ applicationId }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/assign`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),

    /**
     * Unassign refund application at admin
     */
    unassignApplications: builder.mutation<
      AssignRefundResponse,
      { applicationId: string }
    >({
      query: ({ applicationId }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/unassign`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),
    /**
     * Approve refund application at specific level (admin only)
     */
    approveApplicationByLevel: builder.mutation<
      ApprovalActionResponse,
      { applicationId: string } & ApprovalActionRequest
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/approve`,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),

    /**
     * Reject refund application at specific level (admin only)
     */
    rejectApplicationByLevel: builder.mutation<
      ApprovalActionResponse,
      { applicationId: string } & ApprovalActionRequest
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/reject`,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),

    /**
     * Request additional information from tenant (admin L1/L2 only)
     */
    requestInfoFromTenant: builder.mutation<
      ApprovalActionResponse,
      { applicationId: string } & RequestInfoRequest
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/request-info`,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),

    /**
     * Cancel refund application (admin only, before Gl07Generated)
     */
    cancelApplicationByAdmin: builder.mutation<
      ApprovalActionResponse,
      { applicationId: string } & CancelApplicationRequest
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/cancel`,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),

    /**
     * Confirm document status (admin only)
     * Manually confirm document status as VALID or INVALID
     */
    confirmDocumentStatus: builder.mutation<
      ConfirmDocumentStatusResponse,
      ConfirmDocumentStatusRequest
    >({
      query: ({ applicationId, documentId, status, comment }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/documents/${documentId}/confirm-status`,
        method: "POST",
        body: JSON.stringify({ status, comment }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundDocument", id: applicationId },
        { type: "RefundApplication", id: "ADMIN_LIST" },
      ],
    }),

    /**
     * Redact (blur) sensitive areas of a document (admin L1 only)
     */
    redactDocument: builder.mutation<
      RedactDocumentResponse,
      {
        applicationId: string;
        documentId: string;
        body: RedactDocumentRequest;
      }
    >({
      query: ({ applicationId, documentId, body }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/documents/${documentId}/redact`,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "RefundApplication", id: applicationId },
        { type: "RefundDocument", id: applicationId },
        result
          ? {
              type: "RefundDocument",
              id: `${applicationId}_${result.documentId}_versions`,
            }
          : { type: "RefundDocument", id: "UNKNOWN_VERSIONS" },
      ],
    }),

    /**
     * Get document version history (admin L1 only)
     */
    getDocumentVersions: builder.query<
      DocumentVersionDto[],
      { applicationId: string; documentId: string }
    >({
      query: ({ applicationId, documentId }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/documents/${documentId}/versions`,
        method: "GET",
      }),
      providesTags: (result, error, { applicationId, documentId }) => [
        {
          type: "RefundDocument",
          id: `${applicationId}_${documentId}_versions`,
        },
      ],
    }),

    /**
     * Delete a specific version of a document (admin L1 only)
     */
    deleteDocumentVersion: builder.mutation<
      void,
      {
        applicationId: string;
        documentId: string;
        versionId: string;
      }
    >({
      query: ({ applicationId, documentId, versionId }) => ({
        url: `/api/refunds/admin/applications/${applicationId}/documents/${documentId}/versions/${versionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { applicationId, documentId }) => [
        {
          type: "RefundDocument",
          id: `${applicationId}_${documentId}_versions`,
        },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetApplicationsQuery,
  useLazyGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useLazyGetApplicationByIdQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useSubmitApplicationMutation,
  useGetApplicationDocumentsQuery,
  useLazyGetApplicationDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useLazyDownloadDocumentQuery,
  useLazyGetDocumentBlobQuery,
  useVerifyBshMutation,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  useGenerateGL07ReportMutation,
  useLazyDownloadGL07ReportQuery,
  useGetAdminApplicationsQuery,
  useLazyGetAdminApplicationsQuery,
  useApproveApplicationByLevelMutation,
  useRejectApplicationByLevelMutation,
  useRequestInfoFromTenantMutation,
  useCancelApplicationByAdminMutation,
  useConfirmDocumentStatusMutation,
  useReassignApplicationsMutation,
  useAssignApplicationsMutation,
  useUnassignApplicationsMutation,
  useRedactDocumentMutation,
  useGetDocumentVersionsQuery,
  useLazyGetDocumentVersionsQuery,
  useDeleteDocumentVersionMutation,
} = refundsApi;
