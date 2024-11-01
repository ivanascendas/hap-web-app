import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import { PropertyDto } from "../dtos/properties.dto";
import { BalanceRequestDto } from "../dtos/balance-request.dto";
import { BalanceDto } from "../dtos/balance.dto";
import { LoanInfoDto, StatementQueryParams, StatementResponse } from "../dtos/statement.dtos";
import { DocumentDto } from "../dtos/documents.dto";


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
    })
});

export const {
    useLazyGetDocumentsQuery,
    useLazyGetLoanInfoQuery,
    useLazyGetBalanceQuery,
    useLazyGetPropertiesQuery,
    useLazyGetStatementsQuery } = statementsApi;