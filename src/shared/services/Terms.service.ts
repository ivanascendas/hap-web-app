import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";

export const termsApi = createApi({
  reducerPath: "termsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getTerms: builder.query<string, void>({
      query: () => ({
        url: "/api/labels/terms",
        method: "GET",
      }),
    }),

    setTerms: builder.mutation<string, string>({
      query: (body) => ({
        url: "/api/labels/terms",
        method: "POST",
        body: `"${body}"`,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }),
    }),
  }),
});

export const { useGetTermsQuery, useSetTermsMutation } = termsApi;
