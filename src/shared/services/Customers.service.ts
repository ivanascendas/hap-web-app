import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  CustomerDto,
  CustomerQueryParams,
  CustomerUpdateDto,
} from "../dtos/customer.dtos";
import { PaggingResponse } from "../dtos/pagging-base.request";

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    /**
     * Fetches a list of customers based on the provided query parameters.
     * @param params - The query parameters to filter the customer list.
     * @returns A promise that resolves to the customer response data.
     */
    getCustomers: builder.query<
      PaggingResponse<CustomerDto>,
      CustomerQueryParams
    >({
      query: (params) => ({
        url: "/api/customer",
        method: "GET",
        params,
      }),
    }),
    /**
     * Fetches a single customer based on the provided customer number.
     * @param customerNumber - The unique identifier of the customer to fetch.
     * @returns A promise that resolves to the customer data.
     */
    getCustomer: builder.query<CustomerDto, string>({
      query: (customerNumber) => ({
        url: `/api/customer(${customerNumber})`,
        method: "GET",
      }),
    }),

    /**
     * Updates a customer based on the provided customer data.
     * @param body - An object containing the updated customer data. The keys should match the properties of the `CustomerDto` type.
     * @returns A promise that resolves to the updated customer data.
     */
    updateCustomer: builder.mutation<void, Partial<CustomerUpdateDto>>({
      query: ({ customerNumber, ...body }) => ({
        url: `/api/customer(${customerNumber})`,
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    /**
     * Resets the password for a customer based on the provided customer number.
     * @param customerNumber - The unique identifier of the customer whose password should be reset.
     * @returns A promise that resolves to the updated customer data.
     */
    resetCustomerPassword: builder.mutation<CustomerDto, string>({
      query: (customerNumber) => ({
        url: `/api/customer(${customerNumber})/ResetPassword`,
        method: "POST",
      }),
    }),

    /**
     * Deactivates a customer account.
     * @param customerNumber - The unique identifier of the customer to deactivate.
     * @returns A promise that resolves to a string message with the operation result.
     */
    deactivateCustomer: builder.mutation<string, string>({
      query: (customerNumber) => ({
        url: `/api/customer(${customerNumber})/Deactivate`,
        method: "POST",
      }),
    }),

    /**
     * Activates a previously deactivated customer account.
     * @param customerNumber - The unique identifier of the customer to activate.
     * @returns A promise that resolves when activation is successful.
     */
    activateCustomer: builder.mutation<void, string>({
      query: (customerNumber) => ({
        url: `/api/customer(${customerNumber})/Activate`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useLazyGetCustomerQuery,
  useUpdateCustomerMutation,
  useResetCustomerPasswordMutation,
  useDeactivateCustomerMutation,
  useActivateCustomerMutation,
} = customersApi;
