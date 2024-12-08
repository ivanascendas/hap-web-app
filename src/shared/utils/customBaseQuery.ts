import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { errorHandler } from "./getErrorMessage";
import { authApi } from "../services/Auth.service";
import { RootState } from "../redux/store";
import { clearToken } from "../redux/slices/authSlice";

/**
 * Custom base query function for Redux Toolkit Query.
 * This function wraps the `fetchBaseQuery` to add custom logic such as setting
 * authorization headers, handling loading state, and custom error handling.
 *
 * @param args - The arguments for the base query, which can be a string URL or an object containing URL, method, and optional body.
 * @param api - The API object provided by Redux Toolkit Query, containing dispatch and other utilities.
 * @param extraOptions - Additional options that can be passed to the base query.
 * @returns A promise that resolves to the result of the base query, including any custom error handling.
 *
 * @template T - The type of the body parameters, which can be a string, an object with string keys and values, or a generic type.
 */

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokenData?.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

type BodyParams<T> = { [key: string]: string } | string | T;

/**
 * A custom base query function for handling API requests with additional logic.
 *
 * @template TArgs - The type of the arguments passed to the query function.
 * @template TResult - The type of the result returned by the query function.
 * @template TError - The type of the error returned by the query function.
 *
 * @param {TArgs} args - The arguments for the query, which can be a string or an object containing the URL, method, and optional body.
 * @param {BaseQueryApi} api - The API object provided by RTK Query, containing dispatch and other utilities.
 * @param {unknown} extraOptions - Additional options that can be passed to the query function.
 *
 * @returns {Promise<QueryReturnValue<TResult, TError>>} - A promise that resolves to the result of the query, containing either the data or an error.
 *
 * @example
 * const result = await customBaseQuery('/api/data', api, {});
 * if (result.error) {
 *   console.error('Error:', result.error);
 * } else {
 *   console.log('Data:', result.data);
 * }
 *
 * @remarks
 * This function dispatches a loading state before making the request and handles errors by dispatching appropriate actions.
 * It also includes custom logic for handling specific error statuses, such as logging out the user on a 401 Unauthorized error.
 */
const customBaseQuery: BaseQueryFn<
  string | { url: string; method: string; body?: BodyParams<string> },
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const { dispatch } = api;

  try {
    //dispatch(setloading(true));
    const result = await baseQuery(args, api, extraOptions);
    if (result.error) {
      if (
        result.error.status === 403 &&
        typeof args !== "string" &&
        (args.url.includes("/api/user/logout") ||
          args.url.includes("/api/user"))
      ) {
        dispatch(clearToken());
      }
      if (result.error.status === 401) {
        dispatch(authApi.endpoints.logout.initiate());
      } else if (
        !(
          typeof args !== "string" &&
          args.url.includes("/api/statement/details/invoice/file") &&
          result.error.status === 404
        )
      ) {
        dispatch(errorHandler(result.error));
      }
    }
    return result;
  } catch (error) {
    dispatch(errorHandler(error));
    return { error: { status: "FETCH_ERROR", error: String(error) } };
  } /*finally {
    dispatch(setloading(false));
  }*/
};

export default customBaseQuery;
