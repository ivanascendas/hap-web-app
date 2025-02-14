import { createApi } from "@reduxjs/toolkit/query/react";

import customBaseQuery from "../utils/customBaseQuery";
import {
  EmailOTPRequestDto,
  SmsOTPRequestDto,
} from "../dtos/verification.dtos";
import { setUser } from "../redux/slices/authSlice";
import { UserAuthStatusDto } from "../dtos/user.dto";
import { MfaDto } from "../dtos/mfa.dto";
import { DobDto } from "../dtos/dob.dto";

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
    }),
    /**
     * Sends a request to confirm a SMS one-time password (OTP) verification.
     *
     * @param otp - The SMS OTP code to be verified.
     * @returns A boolean indicating whether the SMS OTP verification was successful.
     */
    smsOtpConfirmation: builder.mutation<boolean, MfaDto>({
      query: ({ otp, accountNumber }) => {
        return {
          url: `/api/user/PhoneConfirmation?userid=${accountNumber}&token=${otp}`,
          method: "POST",
          headers: {
            Authorization: undefined,
          },
        };
      },
    }),
    /**
     * Sends a request to confirm an email one-time password (OTP) verification.
     *
     * @param otp - The email OTP code to be verified.
     * @returns A boolean indicating whether the email OTP verification was successful.
     */
    emailOtpConfirmation: builder.mutation<boolean, MfaDto>({
      query: ({ otp, accountNumber }) => {
        return {
          url: `/api/user/EmailRegConfirmation?userid=${accountNumber}&token=${otp}`,
          method: "POST",
          headers: {
            Authorization: undefined,
          },
        };
      },
    }),

    /**
     * Sends a request to confirm a date of birth (DOB) one-time password (OTP) verification.
     *
     * @param dob - The DOB OTP code to be verified.
     * @returns A boolean indicating whether the DOB OTP verification was successful.
     */
    dobConfirmation: builder.mutation<boolean, DobDto>({
      query: ({ dob, accountNumber }) => {
        return {
          url: `/api/user/DOBRegConfirmation?userid=${accountNumber}&dob=${dob}`,
          method: "POST",
          headers: {
            Authorization: undefined,
          },
        };
      },
    }),
    /**
     * Sends a request to check the verification status of a user's account.
     *
     * @param accountNumber - The account number of the user to check.
     * @returns A `UserAuthStatusDto` object containing the user's phone number and email confirmation status, as well as the default MFA method.
     */
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
