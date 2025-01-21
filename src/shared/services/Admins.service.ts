import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  AdminDto,
  CreateAdminDto,
  UpdateAdminDto,
  UpdatePasswordByAdminDto,
} from "../dtos/admins.dtos";

export const adminsApi = createApi({
  reducerPath: "adminsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getAdmins: builder.query<AdminDto[], void>({
      query: () => ({
        url: "/api/user/GetAdmins",
        method: "GET",
      }),
    }),
    createAdmin: builder.mutation<void, CreateAdminDto>({
      query: (body) => ({
        url: "/api/user/CreateAdmin",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),
    updateAdmin: builder.mutation<void, UpdateAdminDto>({
      query: (body) => ({
        url: "/api/user/UpdateAdmin",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),
    updateAdminPassword: builder.mutation<void, UpdatePasswordByAdminDto>({
      query: (body) => ({
        url: "/api/user/UpdatePasswordByAdmin",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),
  }),
});

export const {
  useLazyGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminPasswordMutation,
} = adminsApi;
