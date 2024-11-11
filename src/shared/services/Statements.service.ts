import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import { PropertyDto } from "../dtos/properties.dto";
import { BalanceRequestDto } from "../dtos/balance-request.dto";
import { BalanceDto } from "../dtos/balance.dto";
import { LoanInfoDto, StatementQueryParams, StatementResponse } from "../dtos/statement.dtos";
import { DocumentDto } from "../dtos/documents.dto";
import { InvoiceInputRequest, InvoiceWithRelatedPayments } from "../dtos/invoice.dto";


export const statementsApi = createApi({
    reducerPath: "statementsApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getBalance: builder.query<BalanceDto, BalanceRequestDto>({
            query: (params) => ({
                url: "/api/statement/balance",
                method: "GET",
                params
            }),
        }),
        getProperties: builder.query<PropertyDto[], void>({
            query: () => ({
                url: "/api/statement/properties",
                method: "GET",
            }),
        }),

        getStatements: builder.query<StatementResponse, StatementQueryParams>({
            query: (params) => ({
                url: "/api/statement",
                method: "GET",
                params
            }),
        }),
        getInvoiceDetails: builder.query<InvoiceWithRelatedPayments, InvoiceInputRequest>({
            query: (params) => ({
                url: "/api/statement/details/invoice",
                method: "GET",
                params
            }),
        }),
        getLoanInfo: builder.query<LoanInfoDto, void>({
            query: () => ({
                url: "/api/additionalInfo/loanInfo",
                method: "GET",
            }),
        }),
        getDocuments: builder.query<DocumentDto[], void>({
            query: () => ({
                url: "/api/pdfStatement/GetCustomerDocuments",
                method: "GET",
            }),
        }),
        downloadRatesPdf: builder.query<Blob, StatementQueryParams>({
            query: (params) => ({
                url: `/api/pdfStatement`,
                method: "GET",
                params,
                responseType: 'blob',
                responseHandler: (response: Response) => response.blob(),
            }),
        }),

        downloadDocumentsPdf: builder.query<Blob, number>({
            query: (fileId: number) => ({
                url: `/api/pdfStatement/DownloadDocument`,
                method: "GET",
                params: { fileId },
                responseType: 'blob',
                responseHandler: (response: Response) => {
                    console.log(response);
                    if (response.ok) {
                        return response.blob();
                    } else {
                        return response.json();
                    }
                },
            }),
        }),
    })
});

export const {
    useLazyDownloadDocumentsPdfQuery,
    useLazyDownloadRatesPdfQuery,
    useGetInvoiceDetailsQuery,
    useLazyGetDocumentsQuery,
    useLazyGetLoanInfoQuery,
    useLazyGetBalanceQuery,
    useLazyGetPropertiesQuery,
    useLazyGetStatementsQuery } = statementsApi;