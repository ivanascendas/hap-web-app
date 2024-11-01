import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../utils/customBaseQuery";


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
    })
});

export const { useGetNotificationsCountQuery } = notificationsApi;