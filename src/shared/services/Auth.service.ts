import {
  createApi,
  EndpointDefinitions,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { LoginDto } from "../dtos/login.dto";
import { TokenDto } from "../dtos/token.dto";

/**
 * Encodes a string to a URL-safe base64 string.
 *
 * @param str - The string to be encoded.
 * @returns The URL-safe base64 encoded string.
 */
const base64EncodeUrl = (str: string): string => {
  var base64 = window.btoa(str);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=+$/, "");
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_URL,
  }),
  endpoints: (builder): EndpointDefinitions => {
    return {
      login: builder.mutation<TokenDto, LoginDto>({
        query: ({ username, password }) => {
          const usernameHash = base64EncodeUrl(username);
          const passwordHash = base64EncodeUrl(password);
          return {
            url: `/token?grant_type=password&username=${usernameHash}&password=${passwordHash}&otherway=&vr=2`,
            method: "POST",
          };
        },
      }),
      logout: builder.mutation({
        query: () => ({
          url: "/logout",
          method: "POST",
        }),
      }),
    };
  },
});

export const { useLoginMutation, useLogoutMutation } = authApi as any;
