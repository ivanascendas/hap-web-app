import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  LettersPdfRequest,
  LettersQueryParams,
  LettersResponse,
  ResendLettersDto,
} from "../dtos/letters.dto";
import { PaggingResponse } from "../dtos/pagging-base.request";

export const lettersApi = createApi({
  reducerPath: "lettersApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    /**
     * Fetches a list of invitation letters based on the provided query parameters.
     * @param params - The query parameters to filter the list of invitation letters.
     * @returns A promise that resolves to the invitation letters response data.
     */
    getLetters: builder.query<LettersResponse, LettersQueryParams>({
      query: (params) => ({
        url: "/api/letters/invitation",
        method: "GET",
        params,
      }),
    }),
    /**
     * Fetches a list of invitation letters based on the provided query parameters.
     * @param params - The query parameters to filter the list of invitation letters.
     * @returns A promise that resolves to the invitation letters response data.
     */
    getRemainders: builder.query<LettersResponse, LettersQueryParams>({
      query: (params) => ({
        url: "/api/letters/reminder",
        method: "GET",
        params,
      }),
    }),
    /**
     * Fetches a list of invitation letters based on the provided query parameters.
     * @param params - The query parameters to filter the list of invitation letters.
     * @returns A promise that resolves to the invitation letters response data.
     */
    getResend: builder.query<
      PaggingResponse<ResendLettersDto>,
      LettersQueryParams
    >({
      query: (params) => ({
        url: "/api/letters/resend",
        method: "GET",
        params,
      }),
    }),
    /**
     * Fetches a PDF document containing invitation letters based on the provided request model.
     * @param model - The request model containing the department inclusion flag and the IDs of the letters to include in the PDF.
     * @returns A promise that resolves to the URL of the generated PDF document.
     */
    generateInvationPdf: builder.mutation<string, LettersPdfRequest>({
      query: (model) => ({
        url: `/api/letters/invitationPdf?incDept=${model.incDept}`,
        method: "POST",
        body: JSON.stringify(model.ids),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    /**
     * Fetches a PDF document containing reminder letters based on the provided request model.
     * @param model - The request model containing the department inclusion flag and the IDs of the letters to include in the PDF.
     * @returns A promise that resolves to the URL of the generated PDF document.
     */
    generateReminderPdf: builder.mutation<string, LettersPdfRequest>({
      query: (model) => ({
        url: `/api/letters/reminderPdf?incDept=${model.incDept}`,
        method: "POST",
        body: JSON.stringify(model.ids),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    /**
     * Fetches a PDF document containing resend letters based on the provided request model.
     * @param model - The request model containing the department inclusion flag and the IDs of the letters to include in the PDF.
     * @returns A promise that resolves to the URL of the generated PDF document.
     */
    generateResendPdf: builder.mutation<string, LettersPdfRequest>({
      query: (model) => ({
        url: `/api/letters/resendPdf?incDept=${model.incDept}`,
        method: "POST",
        body: JSON.stringify(model.ids),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    removeLetters: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: "/api/letters/clearResend",
        method: "POST",
        body: JSON.stringify(ids),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetLettersQuery,
  useLazyGetLettersQuery,
  useGetRemaindersQuery,
  useLazyGetRemaindersQuery,
  useGetResendQuery,
  useLazyGetResendQuery,
  useGenerateInvationPdfMutation,
  useGenerateReminderPdfMutation,
  useGenerateResendPdfMutation,
  useRemoveLettersMutation,
} = lettersApi;
