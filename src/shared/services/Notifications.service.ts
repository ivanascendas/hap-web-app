import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import {
  MessagesRequestDto,
  NotificationDto,
  NotificationReportDto,
  NotificationsExcelSendDto,
  NotificationsSendDto,
} from "../dtos/messages.dtos";
import { PaggingBaseDto, PaggingResponse } from "../dtos/pagging-base.request";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["NotificationCount", "Notifications", "NotificationReport"],
  endpoints: (builder) => ({
    getNotificationsCount: builder.query<number, void>({
      query: () => ({
        url: "/api/pushNotification/getUnreadCount",
        method: "GET",
      }),
      providesTags: ["NotificationCount"],
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
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ notificationId }) => ({
                type: "Notifications" as const,
                id: notificationId,
              })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
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
      invalidatesTags: (_, __, ids) => [
        "NotificationCount",
        ...ids.map((id) => ({ type: "Notifications" as const, id })),
      ],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/api/pushNotification/markAllAsRead",
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      invalidatesTags: [
        "NotificationCount",
        { type: "Notifications", id: "LIST" },
      ],
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
      providesTags: ["NotificationReport"],
    }),
    sendNotification: builder.mutation<void, NotificationsSendDto>({
      query: (body) => ({
        url: "/api/pushNotification/send",
        method: "POST",
        body: JSON.stringify(body),
      }),
      invalidatesTags: ["NotificationReport"],
    }),
    sendExcelNotification: builder.mutation<void, NotificationsExcelSendDto>({
      query: ({ file, model }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", JSON.stringify(model));

        return {
          url: "/api/pushNotification/sendByExcel",
          method: "POST",
          body: formData as unknown as Record<string, string>, // Type cast for RTK Query compatibility
        };
      },
      invalidatesTags: ["NotificationReport"],
    }),
  }),
});

export const {
  useSendExcelNotificationMutation,
  useSendNotificationMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetNotificationsCountQuery,
  useLazyGetNotificationsQuery,
  useLazyReportQuery,
} = notificationsApi;
