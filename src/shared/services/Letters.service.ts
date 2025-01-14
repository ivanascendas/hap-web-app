import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import { LettersQueryParams, LettersResponse } from "../dtos/letters.dto";

export const lettersApi = createApi({
  reducerPath: "lettersApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    /**
     * Fetches a list of invitation letters based on the provided query parameters.
     * @param params - The query parameters to filter the list of invitation letters.
     * @returns A promise that resolves to the invitation letters response data.
     */
    letters: builder.query<LettersResponse, LettersQueryParams>({
      query: () => ({
        url: "/api/letters/invitation",
        method: "GET",
      }),
    }),
  }),
});

export const {} = lettersApi;
