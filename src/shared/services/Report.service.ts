import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";

import { ReportDto } from "../dtos/reports.dto";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getReports: builder.query<Array<ReportDto>, void>({
      query: () => ({
        url: "/api/ReportUrl",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
