import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  MessagesRequestDto,
  NotificationDto,
  NotificationReportDto,
  NotificationsSendDto,
} from "../dtos/messages.dtos";
import { PaggingBaseDto, PaggingResponse } from "../dtos/pagging-base.request";
import { send } from "process";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getNotificationsCount: builder.query<number, void>({
      query: () => ({
        url: "/api/pushNotification/getUnreadCount",
        method: "GET",
      }),
    }),
    getNotifications: builder.query<
      PaggingResponse<NotificationDto>,
      MessagesRequestDto
    >({
      query: (params) => ({
        url: "/api/pushNotification/customerHistory",
        method: "GET",
        params,
      }),
    }),
    markAsRead: builder.mutation<void, number[]>({
      query: (body) => ({
        url: "/api/pushNotification/markAsRead",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),
    report: builder.query<
      PaggingResponse<NotificationReportDto>,
      PaggingBaseDto
    >({
      query: (params) => ({
        url: "/api/pushNotification/notificationReport",
        method: "GET",
        params,
      }),
    }),
    sendNotification: builder.mutation<void, NotificationsSendDto>({
      query: (body) => ({
        url: "/api/pushNotification/send",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),
    sendExcelNotification: builder.mutation<
      void,
      { file: File; model: NotificationsSendDto }
    >({
      query: ({ file, model }) => {
        const formData = new FormData();
        // formData.append('file', file);
        // formData.append('model', JSON.stringify(model));
        Object.keys(model).forEach((key) => {
          formData.append(
            key,
            model[key as keyof NotificationsSendDto] as string,
          );
        });
        formData.append("cutdata", "it will removed");
        return {
          url: "/api/pushNotification/sendByExcel",
          method: "POST",
          body: formData as any,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
    }),
  }),
});

export const {
  useMarkAsReadMutation,
  useGetNotificationsCountQuery,
  useLazyGetNotificationsQuery,
  useLazyReportQuery,
} = notificationsApi;
