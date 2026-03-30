import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { errorHandler } from "./getErrorMessage";
import { authApi } from "../services/Auth.service";
import { RootState } from "../redux/store";
import { clearToken } from "../redux/slices/authSlice";
import { setError } from "../redux/slices/errorSlice";
import { t } from "i18next";
import { getCorrelationId } from "./correlationId";

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
    headers.set("X-Correlation-Id", getCorrelationId());
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
/** Maximum number of automatic retries for 429 responses. */
const MAX_429_RETRIES = 2;
/** Default delay (ms) when Retry-After header is missing. */
const DEFAULT_RETRY_DELAY_MS = 5_000;
/** Upper bound (ms) for Retry-After to prevent absurdly long waits. */
const MAX_RETRY_DELAY_MS = 30_000;

/**
 * Parse the Retry-After header value into milliseconds.
 * Supports both delay-seconds (integer) and HTTP-date formats.
 * Returns null if the header is missing or unparseable.
 */
export function parseRetryAfter(headerValue: string | null): number | null {
  if (!headerValue) return null;

  // Try integer seconds first
  const seconds = Number(headerValue);
  if (!Number.isNaN(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, MAX_RETRY_DELAY_MS);
  }

  // Try HTTP-date (e.g. "Wed, 21 Oct 2015 07:28:00 GMT")
  const date = Date.parse(headerValue);
  if (!Number.isNaN(date)) {
    const delayMs = date - Date.now();
    return Math.min(Math.max(delayMs, 0), MAX_RETRY_DELAY_MS);
  }

  return null;
}

const customBaseQuery: BaseQueryFn<
  string | { url: string; method: string; body?: BodyParams<string> },
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const { dispatch } = api;

  try {
    //dispatch(setloading(true));
    let result = await baseQuery(args, api, extraOptions);

    // --- Handle 429 Too Many Requests with auto-retry ---
    if (result.error && result.error.status === 429) {
      const retryAfterHeader =
        (result.meta as any)?.response?.headers?.get?.("Retry-After") ?? null;

      let retried = false;
      for (let attempt = 0; attempt < MAX_429_RETRIES; attempt++) {
        const delayMs =
          parseRetryAfter(retryAfterHeader) ?? DEFAULT_RETRY_DELAY_MS;

        // Notify user about the wait
        const delaySec = Math.ceil(delayMs / 1000);
        dispatch(
          setError({
            message: `${t("ERRORS.TOO_MANY_REQUESTS")}. ${t("ERRORS.RETRY_IN", { defaultValue: `Retrying in ${delaySec}s…`, seconds: delaySec })}`,
            duration: delayMs + 1000,
          }),
        );

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        result = await baseQuery(args, api, extraOptions);

        if (!result.error || result.error.status !== 429) {
          retried = true;
          break;
        }
      }

      // If still 429 after all retries, show final user-friendly message and return
      if (result.error && result.error.status === 429) {
        dispatch(setError({ message: t("ERRORS.TOO_MANY_REQUESTS") }));
        return result;
      }

      // If retry succeeded, fall through to normal result processing below
      if (retried && !result.error) {
        return result;
      }
    }

    if (result.error) {
      const url = typeof args !== "string" ? args.url : args;

      if (
        result.error.status === 403 &&
        typeof args !== "string" &&
        (url.includes("/api/user/logout") || url.includes("/api/user"))
      ) {
        dispatch(clearToken());
        dispatch(
          errorHandler(new Error("You don't have access to this resource")),
        );
      }
      if (result.error.status === 401) {
        // Avoid infinite loop: don't dispatch logout if the failing request IS the logout request
        if (!url.includes("/api/user/logout")) {
          dispatch(authApi.endpoints.logout.initiate());
        } else {
          // Logout itself failed with 401 — just clear token directly
          dispatch(clearToken());
        }
      } else if (
        !(
          typeof args !== "string" &&
          url.includes("/api/statement/details/invoice/file") &&
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
