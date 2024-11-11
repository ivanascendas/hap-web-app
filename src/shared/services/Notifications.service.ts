import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";
import { MessagesRequestDto, NotificationDto } from "../dtos/messages.dtos";
import { PaggingResponse } from "../dtos/pagging-base.request";


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
        getNotifications: builder.query<PaggingResponse<NotificationDto>, MessagesRequestDto>({
            query: (params) => ({
                url: "/api/pushNotification/customerHistory",
                method: "GET",
                params
            }),
        }),
        markAsRead: builder.mutation<void, number[]>({
            query: (body) => ({
                url: "/api/pushNotification/markAsRead",
                method: "POST",
                body: JSON.stringify(body),
                headers: ({
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                })
            }),
        })
    })
});

export const {
    useMarkAsReadMutation,
    useGetNotificationsCountQuery,
    useLazyGetNotificationsQuery
} = notificationsApi;