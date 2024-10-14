import { createApi } from "@reduxjs/toolkit/query/react";

import { LoginDto, LoginWithCodeDto } from "../dtos/login.dto";
import { TokenDto } from "../dtos/token.dto";
import {
  CheckTempPasswordRequestDto,
  CheckTempPasswordResponseDto,
} from "../dtos/tempPassword.dto";
import { ForgotPasswordRequestDto } from "../dtos/forgotPassword.dto";
import customBaseQuery from "../utils/customBaseQuery";
import { setTmpToken, setToken, setUser } from "../redux/slices/authSlice";
import { verificationApi } from "./Verification.service";
import { RootState } from "../redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { To } from "react-router-dom";

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

const toUrlEncoded = (data: { [key: string]: string }) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
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
      onQueryStarted: async (dto,
        { dispatch, queryFulfilled },) => {

        const { data } = await queryFulfilled;
        dispatch(verificationApi.endpoints.verificationStatus.initiate(parseInt(dto.username)));
        if (data.defaultmfa) {
          dispatch(setUser({ defaultMFA: data.defaultmfa }));
          dispatch(setTmpToken(data));
        } else {
          dispatch(setToken(data));
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
      onQueryStarted: async (dto,
        { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setToken(data));
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
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
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
        const { data } = await queryFulfilled;

        if (data.code === '1') {
          dispatch(
            authApi.endpoints.login.initiate({
              username: dto.accountNumber,
              password: dto.tempPassword,
            }),
          );
        }
        dispatch(setUser({ accountNumber: parseInt(dto.accountNumber) }));
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
  }),
});


export const selectLoginResponse = (state: RootState): TokenDto | undefined => (state.authApi.mutations.login?.data as TokenDto);

export const selectMaskedValue = createSelector(
  selectLoginResponse,
  (data: TokenDto | undefined) => {
    let result: string = "";
    result = data && (data.defaultmfa == 'SMS' ? data.phoneNumber : data.defaultmfa === 'Email' ? data.email : "") || "";
    return result;

  },
);

export const {
  useLoginMutation,
  useLoginWithCodeMutation,
  useLogoutMutation,
  useCheckTempPasswordMutation,
  useForgotPasswordMutation,
} = authApi;
