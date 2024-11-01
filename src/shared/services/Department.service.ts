import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import { DepartmentDto } from "../dtos/department.dto";

/**
 * API service for managing department-related operations.
 * 
 * This service uses `createApi` from Redux Toolkit to define endpoints and handle
 * API interactions related to departments.
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
export const departmentsApi = createApi({
    reducerPath: "departmentsApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        /**
         * Fetches a list of departments.
         *
         * @returns {Promise<DepartmentDto[]>} A promise that resolves to an array of `DepartmentDto` objects.
         */
        getDepartments: builder.mutation<DepartmentDto[], void>({
            query: () => ({
                url: "/api/statement/departments",
                method: "GET",
            }),
        }),
    })
});

export const { useGetDepartmentsMutation } = departmentsApi;