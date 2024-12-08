import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  InvoiceDownloadRequest,
  InvoiceInputRequest,
  InvoiceQueryParams,
  InvoicesResponse,
} from "../dtos/invoice.dtos";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getInvoices: builder.query<InvoicesResponse, InvoiceQueryParams>({
      query: (params) => ({
        url: "/api/payment/invoices",
        method: "GET",
        params,
      }),
    }),

    downloadInvoicePdf: builder.query<Blob, InvoiceDownloadRequest>({
      query: (params) => ({
        url: `/api/statement/details/invoice/file`,
        method: "GET",
        params,
        responseType: "blob",
        responseHandler: async (response: Response) => {
          const blob = await response.blob();
          const filename = `invoice_${params.VoucherNo}_${params.SequenceNo}.pdf`;
          if (blob) {
            if ((window.navigator as any).msSaveOrOpenBlob) {
              (window.navigator as any).msSaveOrOpenBlob(blob, filename);
            } else {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.href = window.URL.createObjectURL(blob);
              a.download = filename;
              a.click();
            }
          }
        },
      }),
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useLazyDownloadInvoicePdfQuery,
} = paymentsApi;
