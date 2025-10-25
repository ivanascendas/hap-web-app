import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  Gl07BatchListItemDto,
  Gl07BatchDto,
  RefundApplicationListItemDto,
  CreateGl07BatchRequest,
  CreateGl07BatchResponse,
  Gl07BatchFileResponse,
  PagedResult,
  Gl07BatchFilterParams,
  ApprovedApplicationsFilterParams,
} from "../dtos/gl07-batch.dtos";

/**
 * RTK Query API for managing GL07 Batches
 */
export const gl07BatchApi = createApi({
  reducerPath: "gl07BatchApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Gl07Batch", "Gl07BatchList", "ApprovedApplications"],
  endpoints: (builder) => ({
    /**
     * Get list of GL07 batches with filtering and pagination
     */
    getBatches: builder.query<
      PagedResult<Gl07BatchListItemDto>,
      Gl07BatchFilterParams | void
    >({
      query: (params) => ({
        url: "/api/refunds/gl07-batches",
        method: "GET",
        params: {
          pageNumber: params?.pageNumber || 1,
          pageSize: params?.pageSize || 25,
          ...(params?.status !== undefined && { status: params.status }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ gl07BatchId }) => ({
                type: "Gl07Batch" as const,
                id: gl07BatchId,
              })),
              { type: "Gl07BatchList", id: "LIST" },
            ]
          : [{ type: "Gl07BatchList", id: "LIST" }],
    }),

    /**
     * Get single GL07 batch by ID with all lines
     */
    getBatchById: builder.query<Gl07BatchDto, string>({
      query: (id) => ({
        url: `/api/refunds/gl07-batches/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Gl07Batch", id }],
    }),

    /**
     * Get list of approved refund applications for batch creation
     */
    getApprovedApplications: builder.query<
      PagedResult<RefundApplicationListItemDto>,
      ApprovedApplicationsFilterParams | void
    >({
      query: (params) => ({
        url: "/api/refunds/gl07-batches/approved-applications",
        method: "GET",
        params: {
          pageNumber: params?.pageNumber || 1,
          pageSize: params?.pageSize || 100,
        },
      }),
      providesTags: [{ type: "ApprovedApplications", id: "LIST" }],
    }),

    /**
     * Create new GL07 batch from selected approved applications
     */
    createBatch: builder.mutation<
      CreateGl07BatchResponse,
      CreateGl07BatchRequest
    >({
      query: (data) => ({
        url: "/api/refunds/gl07-batches",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        { type: "Gl07BatchList", id: "LIST" },
        { type: "ApprovedApplications", id: "LIST" },
      ],
    }),

    /**
     * Export batch to CSV file (changes status from Generated to Exported)
     */
    exportBatch: builder.mutation<Gl07BatchFileResponse, string>({
      query: (id) => ({
        url: `/api/refunds/gl07-batches/${id}/export`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Gl07Batch", id },
        { type: "Gl07BatchList", id: "LIST" },
      ],
    }),

    /**
     * Mark batch as posted to Agresso (changes status from Exported to Posted)
     */
    postBatch: builder.mutation<Gl07BatchFileResponse, string>({
      query: (id) => ({
        url: `/api/refunds/gl07-batches/${id}/post`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Gl07Batch", id },
        { type: "Gl07BatchList", id: "LIST" },
      ],
    }),

    /**
     * Download CSV file for a batch (only for Exported/Posted batches)
     */
    downloadBatch: builder.query<Blob, { id: string; batchNumber: string }>({
      query: ({ id }) => ({
        url: `/api/refunds/gl07-batches/${id}/download`,
        method: "GET",
        responseType: "blob",
        responseHandler: async (response: Response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBatchesQuery,
  useLazyGetBatchesQuery,
  useGetBatchByIdQuery,
  useLazyGetBatchByIdQuery,
  useGetApprovedApplicationsQuery,
  useLazyGetApprovedApplicationsQuery,
  useCreateBatchMutation,
  useExportBatchMutation,
  usePostBatchMutation,
  useLazyDownloadBatchQuery,
} = gl07BatchApi;

/**
 * Helper function to trigger file download
 */
export const downloadBatchFile = async (
  id: string,
  batchNumber: string,
  lazyDownload: ReturnType<typeof useLazyDownloadBatchQuery>[0],
) => {
  try {
    const result = await lazyDownload({ id, batchNumber });

    if ("data" in result && result.data) {
      const blob = new Blob([result.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${batchNumber}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Failed to download batch file:", error);
    throw error;
  }
};
