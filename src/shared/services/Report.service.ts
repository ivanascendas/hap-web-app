import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";

import { ReportDto } from "../dtos/reports.dto";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    /**
     * Fetches a list of customers based on the provided query parameters.
     * @param params - The query parameters to filter the customer list.
     * @returns A promise that resolves to the customer response data.
     */
    getReports: builder.query<Array<ReportDto>, void>({
      query: () => ({
        url: "/api/ReportUrl",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
