import { createApi } from "@reduxjs/toolkit/query/react";

import customBaseQuery from "../utils/customBaseQuery";
import {
  EmailOTPRequestDto,
  SmsOTPRequestDto,
} from "../dtos/verification.dtos";
import { RootState } from "../redux/store";
import { AuthState, setUser } from "../redux/slices/authSlice";
import { UserAuthStatusDto } from "../dtos/user.dto";
import { createSelector } from "@reduxjs/toolkit";

export const verificationApi = createApi({
  reducerPath: "verificationApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    /**
     * Sends a request to initiate a SMS one-time password (OTP) verification.
     *
     * @param body - The request body containing the necessary data for the SMS OTP request.
     * @returns A boolean indicating whether the SMS OTP request was successful.
     */
    smsOptRequest: builder.mutation<boolean, SmsOTPRequestDto>({
      query: (body: SmsOTPRequestDto) => {
        return {
          url: `/api/user/PhoneConfirmationRequest`,
          method: "POST",
          body,
          headers: {
            Authorization: undefined,
          },
        };
      },
      transformResponse: (response: { success: boolean }) => {
        return response.success;
      },
    }),
    /**
     * Sends a request to initiate an email one-time password (OTP) verification.
     *
     * @param body - The request body containing the necessary data for the email OTP request.
     * @returns A boolean indicating whether the email OTP request was successful.
     */
    emailOptRequest: builder.mutation<boolean, EmailOTPRequestDto>({
      query: (body: EmailOTPRequestDto) => {
        return {
          url: `/api/user/EmailRegConfirmationRequest`,
          method: "POST",
          body,
        };
      },
      transformResponse: (response: { success: boolean }) => {
        return response.success;
      },
    }),
    /**
     * Sends a request to confirm a SMS one-time password (OTP) verification.
     *
     * @param otp - The SMS OTP code to be verified.
     * @returns A boolean indicating whether the SMS OTP verification was successful.
     */
    smsOtpConfirmation: builder.mutation<boolean, string>({
      query: (otp: string) => {
        return {
          url: `/api/user/PhoneConfirmation?userid=&token=${otp}`,
          method: "POST",
          headers: {
            Authorization: undefined,
          },
        };
      },
      async onQueryStarted(otp, { dispatch, getState, queryFulfilled }) {
        const { user }: AuthState = (getState() as RootState).auth;
        if (user) {
          dispatch(
            verificationApi.util.updateQueryData(
              "smsOtpConfirmation" as never,
              otp as never,
              (draft: { url: string }) => {
                draft.url = `/api/user/PhoneConfirmation?userid=${user.accountNumber}&token=${otp}`;
              },
            ),
          );
        }
        await queryFulfilled;
      },
      transformResponse: (response: { success: boolean }) => {
        return response.success;
      },
    }),
    /**
     * Sends a request to confirm an email one-time password (OTP) verification.
     *
     * @param otp - The email OTP code to be verified.
     * @returns A boolean indicating whether the email OTP verification was successful.
     */
    emailOtpConfirmation: builder.mutation<boolean, string>({
      query: (otp: string) => {
        return {
          url: `/api/user/EmailRegConfirmation?userid=&token=${otp}`,
          method: "POST",
          headers: {
            Authorization: undefined,
          },
        };
      },

      async onQueryStarted(otp, { dispatch, getState, queryFulfilled }) {
        const { user }: AuthState = (getState() as RootState).auth;
        if (user) {
          dispatch(
            verificationApi.util.updateQueryData(
              "emailOtpConfirmation" as never,
              otp as never,
              (draft: { url: string }) => {
                draft.url = `/api/user/EmailRegConfirmation?userid=${user.accountNumber}&token=${otp}`;
              },
            ),
          );
        }
        await queryFulfilled;
      },
      transformResponse: (response: { success: boolean }) => {
        return response.success;
      },
    }),

    /**
     * Sends a request to confirm a date of birth (DOB) one-time password (OTP) verification.
     *
     * @param dob - The DOB OTP code to be verified.
     * @returns A boolean indicating whether the DOB OTP verification was successful.
     */
    dobConfirmation: builder.mutation<boolean, string>({
      query: (dob: string) => {
        return {
          url: `/api/user/DOBRegConfirmation?userid=&dob=${dob}`,
          method: "POST",
          headers: {
            Authorization: undefined,
          },
        };
      },
      async onQueryStarted(dob, { dispatch, getState, queryFulfilled }) {
        const { user }: AuthState = (getState() as RootState).auth;
        if (user) {
          dispatch(
            verificationApi.util.updateQueryData(
              "dobConfirmation" as never,
              dob as never,
              (draft: { url: string }) => {
                draft.url = `/api/user/DOBRegConfirmation?userid=${user.accountNumber}&dob=${dob}`;
              },
            ),
          );
        }
        await queryFulfilled;
      },
      transformResponse: (response: { success: boolean }) => {
        return response.success;
      },
    }),
    verificationStatus: builder.mutation<UserAuthStatusDto, number>({
      query: (accountNumber) => ({
        url: `/api/user/CheckValidContact?AccountNumber=${accountNumber}`,
        method: "POST",
        headers: {
          Authorization: undefined,
        },
      }),
      onQueryStarted: async (dto, { dispatch, queryFulfilled }) => {

        const { data } = await queryFulfilled;

        dispatch(setUser({
          phoneNumberConfirmed: data.isPhoneConfirmed,
          emailConfirmed: data.isEmailConfirmed,
          defaultMFA: data.defaultMFA,
        }));
      }
    }),

  }),
});



export const {
  useSmsOptRequestMutation,
  useEmailOptRequestMutation,
  useSmsOtpConfirmationMutation,
  useEmailOtpConfirmationMutation,
  useDobConfirmationMutation,
  useVerificationStatusMutation,
} = verificationApi;
