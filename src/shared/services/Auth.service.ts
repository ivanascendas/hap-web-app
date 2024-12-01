import { createApi } from "@reduxjs/toolkit/query/react";

import { LoginDto, LoginWithCodeDto } from "../dtos/login.dto";
import { TokenDto } from "../dtos/token.dto";
import {
  CheckTempPasswordRequestDto,
  CheckTempPasswordResponseDto,
} from "../dtos/tempPassword.dto";
import { ForgotPasswordRequestDto } from "../dtos/forgotPassword.dto";
import customBaseQuery from "../utils/customBaseQuery";
import {
  clearToken,
  clearUser,
  setTmpToken,
  setToken,
  setUser,
} from "../redux/slices/authSlice";
import { verificationApi } from "./Verification.service";
import { RootState } from "../redux/store";
import { createSelector, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { RegistrationRequestDto } from "../dtos/registration.dto";
//import { setloading } from "../redux/slices/loaderSlice";
import { ResetPasswordDto } from "../dtos/resetPassword.dto";
import { errorHandler } from "../utils/getErrorMessage";
import { UserModel } from "../models/user.model";
import { notificationsApi } from "./Notifications.service";
import {
  CheckValidContactDto,
  ExsistingTenantDto,
} from "../dtos/existing-tenant.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { use } from "i18next";
import {
  PhoneConfirmationDto,
  PhoneConfirmationRequestDto,
} from "../dtos/phone-confirmation.dtos";
import {
  EmailConfirmationDto,
  EmailConfirmationRequestDto,
} from "../dtos/email-confirmation.dtos";

/**
 * Encodes a string to a URL-safe base64 string.
 *
 * @param str - The string to be encoded.
 * @returns The URL-safe base64 encoded string.
 */
const base64EncodeUrl = (str: string): string => {
  const base64 = window.btoa(str);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/\\=+$/, "");
};

/**
 * Converts an object of key-value pairs into a URL-encoded string.
 *
 * @param data - An object containing the key-value pairs to be encoded.
 * @returns A URL-encoded string representation of the input object.
 */
const toUrlEncoded = (data: { [key: string]: string }) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

/**
 * Handles the processing of an authentication token received from the server.
 *
 * @param data - The `TokenDto` object containing the authentication token.
 * @param dispatch - The Redux dispatch function to update the application state.
 */
export const handleToken = (
  data: TokenDto,
  dispatch: ThunkDispatch<RootState, unknown, UnknownAction>,
) => {
  //dispatch(setloading(true));
  dispatch(setToken(data));
  dispatch(authApi.endpoints.userdata.initiate());
  dispatch(notificationsApi.endpoints.getNotificationsCount.initiate());
};

/**
 * Provides a set of API endpoints for authentication-related operations, including login, logout, and checking temporary password.
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Check", "Token", "User"],
  endpoints: (builder) => ({
    /**
     * Fetches the current user's data from the server and updates the application state.
     *
     * This endpoint is used to retrieve the current user's data, such as their profile information, permissions, and other relevant details. The fetched data is then dispatched to update the application state.
     *
     * @returns The current user's data as a `UserModel` object.
     */
    userdata: builder.query<UserModel, void>({
      query: () => ({
        url: "/api/user",
        method: "GET",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          dispatch(clearUser());
          const { data } = await queryFulfilled;
          if (data && data.customerNo) {
            dispatch(
              authApi.endpoints.checkValidContact.initiate(
                parseInt(data.customerNo),
              ),
            );
          }
        } catch (error) {
          dispatch(errorHandler(error));
        }
      },
    }),

    /**
     * Sends a POST request to the `/token` endpoint with the provided `LoginDto` object, and returns the `TokenDto` object.
     *
     * @param username - The username to be used for authentication.
     * @param password - The password to be used for authentication.
     * @param mfaMethod - The MFA method to be used for authentication.
     * @returns The `TokenDto` object containing the authentication token.
     */
    login: builder.mutation<TokenDto, LoginDto>({
      query: ({ username, password, mfaMethod }) => {
        const usernameHash = base64EncodeUrl(username);
        const passwordHash = base64EncodeUrl(password);
        return {
          url: `/token`,
          method: "POST",
          body: toUrlEncoded({
            grant_type: "password",
            username: usernameHash,
            password: passwordHash,
            otherway: mfaMethod || "",
            vr: "2",
          }),
        };
      },
      onQueryStarted: async (dto, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            verificationApi.endpoints.verificationStatus.initiate(
              parseInt(dto.username),
            ),
          );
          if (data.defaultmfa) {
            dispatch(setUser({ defaultMFA: data.defaultmfa }));
            dispatch(setTmpToken(data));
          } else {
            handleToken.call(this, data, dispatch);
          }
        } catch (error) {
          dispatch(errorHandler(error));
        }
      },
      transformResponse: (response: TokenDto) => {
        return response;
      },
    }),

    /**
     * Sends a POST request to the `/token` endpoint with the provided `LoginWithCodeDto` object, and returns the `TokenDto` object.
     *
     * @param code - The code to be used for authentication.
     * @param token - The token to be used for authentication.
     * @param mfaMethod - The MFA method to be used for authentication.
     * @returns The `TokenDto` object containing the authentication token.
     */
    loginWithCode: builder.mutation<TokenDto, LoginWithCodeDto>({
      query: ({ code, token, mfaMethod }) => {
        const codeHash = base64EncodeUrl(code);
        return {
          url: `/token`,
          method: "POST",
          body: toUrlEncoded({
            grant_type: "code",
            v: codeHash,
            token: token,
            otherway: mfaMethod || "",
            vr: "2",
          }),
        };
      },
      onQueryStarted: async (dto, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          handleToken.call(this, data, dispatch);
        } catch (error) {
          dispatch(errorHandler(error));
        }
      },
      transformResponse: (response: TokenDto) => {
        return response;
      },
    }),
    /**
     * Logs the current user out by sending a POST request to the `/logout` endpoint.
     *
     * @returns An object with the URL and HTTP method for the logout request.
     */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/user/logout",
        method: "POST",
      }),
    }),
    /**
     * Sends a POST request to the `/api/user/checkTempPassword` endpoint with the provided `CheckTempPasswordRequestDto` object, and returns the `CheckTempPasswordResponseDto` object.
     *
     * @param body - The `CheckTempPasswordRequestDto` object containing the data to be sent in the request body.
     * @returns The `CheckTempPasswordResponseDto` object containing the response data.
     */
    checkTempPassword: builder.mutation<
      CheckTempPasswordResponseDto,
      CheckTempPasswordRequestDto
    >({
      query: (body) => ({
        url: "/api/user/checkTempPassword",
        method: "POST",
        body,
      }),
      onQueryStarted: async (
        dto: CheckTempPasswordRequestDto,
        { dispatch, queryFulfilled },
      ) => {
        try {
          const { data } = await queryFulfilled;

          if (data && data.code === "1") {
            dispatch(
              authApi.endpoints.login.initiate({
                username: dto.accountNumber,
                password: dto.tempPassword,
              }),
            );
          }
          dispatch(
            setUser({
              accountNumber: parseInt(dto.accountNumber),
              tempPassword: dto.tempPassword,
            }),
          );
        } catch (error) {
          dispatch(errorHandler(error));
        }
      },
    }),

    /**
     * Sends a POST request to the `/api/user/forgotPassword` endpoint with the provided `ForgotPasswordRequestDto` object, and returns `void`.
     *
     * @param body - The `ForgotPasswordRequestDto` object containing the data to be sent in the request body.
     * @returns `void`
     */
    forgotPassword: builder.mutation<void, ForgotPasswordRequestDto>({
      query: (body) => ({
        url: "/api/user/forgotPassword",
        method: "POST",
        body,
      }),
    }),

    /**
     * Sends a POST request to the `/api/user/register` endpoint with the provided `RegistrationRequestDto` object, and returns `void`.
     *
     * @param body - The `RegistrationRequestDto` object containing the data to be sent in the request body.
     * @returns `void`
     * @remarks
     * After a successful registration, this method will also initiate a login request with the provided username and password.
     */
    regitration: builder.mutation<void, RegistrationRequestDto>({
      query: (body) => ({
        url: "/api/user/register",
        method: "POST",
        body,
      }),
      onQueryStarted: async (
        dto: RegistrationRequestDto,
        { dispatch, queryFulfilled },
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            authApi.endpoints.login.initiate({
              username: dto.accountNumber,
              password: dto.password,
            }),
          );
        } catch (error) {
          dispatch(errorHandler(error));
        } /*finally {
          dispatch(setloading(false));
        }*/
      },
    }),

    /**
     * Sends a POST request to the `/api/user/resetPassword` endpoint with the provided `ResetPasswordDto` object, and returns `void`.
     *
     * @param body - The `ResetPasswordDto` object containing the data to be sent in the request body.
     * @returns `void`
     */
    resetPassword: builder.mutation<void, ResetPasswordDto>({
      query: (body) => ({
        url: "/api/user/resetPassword",
        method: "POST",
        body,
      }),
    }),

    /**
     * Sends a POST request to the `/api/user/changePassword` endpoint with the provided `ChangePasswordDto` object, and returns `void`.
     *
     * @param body - The `ChangePasswordDto` object containing the data to be sent in the request body.
     * @returns `void`
     */
    changePassword: builder.mutation<void, ChangePasswordDto>({
      query: (body) => ({
        url: "/api/user/changePassword",
        method: "POST",
        body,
      }),
    }),

    /** Sends a POST request to the `/api/user/SaveExistingTenantMFA` endpoint with the provided `ExsistingTenantDto` object, and returns `void`. */
    saveUserData: builder.mutation<void, ExsistingTenantDto>({
      query: (body: ExsistingTenantDto) => ({
        url: "/api/user/SaveExistingTenantMFA",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    /**
     * Sends a POST request to the `/api/user/CheckValidContact` endpoint with the provided `accountNumber` parameter, and returns a `CheckValidContactDto` object.
     *
     * @param accountNumber - The account number to be used in the request.
     * @returns A `CheckValidContactDto` object containing the response data.
     */
    checkValidContact: builder.mutation<CheckValidContactDto, number>({
      query: (accountNumber: number) => ({
        url: `/api/user/CheckValidContact?AccountNumber=${accountNumber}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    /**
     * Sends a POST request to the `/api/user/PhoneConfirmationRequest` endpoint with the provided `PhoneConfirmationRequestDto` object, and returns `void`.
     *
     * @param body - The `PhoneConfirmationRequestDto` object containing the data to be sent in the request body.
     * @returns `void`
     */
    phoneConfirmationRequest: builder.mutation<
      void,
      PhoneConfirmationRequestDto
    >({
      query: (body) => ({
        url: "/api/user/PhoneConfirmationRequest",
        method: "POST",
        body,
      }),
    }),
    /**
     * Sends a POST request to the `/api/user/PhoneConfirmationRequest` endpoint with the provided `PhoneConfirmationDto` object, and returns `void`.
     *
     * @param body - The `PhoneConfirmationDto` object containing the `userId` and `code` to be sent in the request body.
     * @returns `void`
     */
    phoneConfirmation: builder.mutation<void, PhoneConfirmationDto>({
      query: (body) => ({
        url: `/api/user/PhoneConfirmation?userId=${body.userId}&token=${body.code}`,
        method: "POST",
      }),
    }),

    /**
     * Sends a POST request to the `/api/user/EmailRegConfirmationRequest` endpoint with the provided `EmailConfirmationRequestDto` object, and returns `void`.
     *
     * @param body - The `EmailConfirmationRequestDto` object containing the data to be sent in the request body.
     * @returns `void`
     */
    emailConfirmationRequest: builder.mutation<
      void,
      EmailConfirmationRequestDto
    >({
      query: (body) => ({
        url: "/api/user/EmailRegConfirmationRequest",
        method: "POST",
        body,
      }),
    }),
    /**
     * Sends a POST request to the `/api/user/EmailRegConfirmation` endpoint with the provided `EmailConfirmationDto` object, and returns `void`.
     *
     * @param body - The `EmailConfirmationDto` object containing the `userId` and `code` to be sent in the request body.
     * @returns `void`
     */
    emailConfirmation: builder.mutation<void, EmailConfirmationDto>({
      query: (body) => ({
        url: `/api/user/EmailRegConfirmation?userId=${body.userId}&token=${body.code}`,
        method: "POST",
      }),
    }),
  }),
});

export const selectLoginResponse = (state: RootState): TokenDto | null =>
  state.auth.tmpTokenData;

export const selectMaskedValue = createSelector(
  selectLoginResponse,
  (data: TokenDto | null) => {
    let result: string = "";
    result =
      (data &&
        (data.defaultmfa == "SMS"
          ? data.phoneNumber
          : data.defaultmfa === "Email"
            ? data.email
            : "")) ||
      "";
    return result;
  },
);

export const {
  useLoginMutation,
  useLoginWithCodeMutation,
  useLogoutMutation,
  useCheckTempPasswordMutation,
  useForgotPasswordMutation,
  useRegitrationMutation,
  useResetPasswordMutation,
  useLazyUserdataQuery,
  useSaveUserDataMutation,
  useChangePasswordMutation,
  useCheckValidContactMutation,
  usePhoneConfirmationRequestMutation,
  useEmailConfirmationRequestMutation,
  usePhoneConfirmationMutation,
  useEmailConfirmationMutation,
} = authApi;
