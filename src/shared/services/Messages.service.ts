import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import { ErrorMessagesDto } from "../dtos/message.dto";

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getMessages: builder.query<ErrorMessagesDto, void>({
      query: () => ({
        url: "/api/labels/short",
        method: "GET",
      }),
    }),

    setMessages: builder.mutation<ErrorMessagesDto, ErrorMessagesDto>({
      query: (body) => ({
        url: "/api/labels/short",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useSetMessagesMutation } = messagesApi;
