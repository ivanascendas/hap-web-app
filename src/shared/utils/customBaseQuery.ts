import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { setloading } from "../redux/slices/loaderSlice";
import { setError } from "../redux/slices/errorSlice";

const baseQuery = fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL });

const customBaseQuery: BaseQueryFn<
  | string
  | { url: string; method: string; body?: { [key: string]: string } | string },
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const { dispatch } = api;
  try {
    dispatch(setloading(true));
    const result = await baseQuery(args, api, extraOptions);
    // Add custom logic here if needed, for example, handling custom error codes or logging
    if (result.error) {
      // Customize error handling here
      console.error("Error in API call:", result.error);
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      dispatch(setError(error.message));
    } else if (typeof error === "string") {
      dispatch(setError(error));
    } else {
      dispatch(setError("Something went wrong"));
    }
    return { error: { status: "FETCH_ERROR", error: String(error) } };
  } finally {
    dispatch(setloading(false));
  }
};

export default customBaseQuery;
