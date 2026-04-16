import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import { ConfigurationDto } from "@shared/dtos/configuration.dto";

/**
 * API service for managing configuration-related operations.
 *
 * This service uses `createApi` from Redux Toolkit to define endpoints and handle
 * API interactions related to configurations.
 *
 * @constant
 * @type {Api}
 *
 * @property {string} reducerPath - The path to the reducer in the Redux store.
 * @property {BaseQueryFn} baseQuery - The base query function for making API requests.
 * @property {Object} endpoints - The endpoints defined for this API service.
 *
 * @example
 * // Example usage:
 * import { useGetDepartmentsMutation } from './Department.service';
 *
 * const [getDepartments, { data, error, isLoading }] = useGetDepartmentsMutation();
 *
 * getDepartments();
 */
export const configurationsApi = createApi({
  reducerPath: "configurationsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getConfiguration: builder.query<ConfigurationDto, void>({
      query: () => ({
        url: "/api/configuration",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetConfigurationQuery } = configurationsApi;
