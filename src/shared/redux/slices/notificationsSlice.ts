import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { notificationsApi } from "../../services/Notifications.service";
import { NotificationDto } from "../../dtos/messages.dtos";
import { stat } from "fs";

export type NotificationsState = {
    list: NotificationDto[];
    unreadCount: number;
    count: number;
};

const initialState: NotificationsState = {
    list: [],
    unreadCount: 0,
    count: 0,
};

/**
 * Redux slice for managing the state of notifications in the application.
 * 
 * The `notificationsSlice` contains reducers for setting and clearing the list of notifications,
 * as well as handling the fulfilled action from the `getNotifications` API endpoint.
 * 
 * The `selectNotifications` selector function can be used to retrieve the list of notifications
 * from the Redux store.
 */

const notificationsSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        /**
         * Sets the list of notifications in the state.
         *
         * @param state - The current state of the notifications slice.
         * @param action - The action that contains the new list of notifications.
         * @returns The updated state with the new list of notifications.
         */
        setNotifications: (state: NotificationsState, action: PayloadAction<NotificationsState>) => {
            return { ...state, list: action.payload.list };
        },
        /**
         * Clears the list of notifications in the state.
         *
         * @param state - The current state of the notifications slice.
         * @returns The updated state with an empty list of notifications.
         */
        clearNotifications: (state: NotificationsState) => {
            state.list = [];
        },
    },
    extraReducers(builder) {
        /**
         *  Handles the fulfilled action from the `getNotificationsCount` API endpoint.
         */
        builder.addMatcher(
            notificationsApi.endpoints.getNotificationsCount.matchFulfilled,
            (state, action) => {
                state.unreadCount = action.payload;
            }
        );


        /**
         *  Handles the fulfilled action from the `getNotifications ` API endpoint.
         */
        builder.addMatcher(
            notificationsApi.endpoints.getNotifications.matchFulfilled,
            (state, { payload }) => {
                state.list = payload.items;
                state.count = payload.count;
            }
        );

        /**
         *  Handles the fulfilled action from the `markAsRead` API endpoint.
         */
        builder.addMatcher(
            notificationsApi.endpoints.markAsRead.matchFulfilled,
            (state, { payload, meta }) => {
                const readedNotifications: Array<number> = meta.arg.originalArgs
                state.unreadCount -= readedNotifications.length;
                state.list = [...state.list.map((notification: NotificationDto) => {
                    if (!notification.isRead) {
                        notification.isRead = readedNotifications.includes(notification.notificationId);
                    }
                    return notification;
                })];
            }
        );
    },
});


/**
 * Selects the list of notifications from the Redux store.
 *
 * @param state - The root state of the Redux store.
 * @returns The list of notifications.
 */
export const selectUnreadNotificationsCount = (state: RootState): number => state.notifications.unreadCount;

/**
 * Selects the list of notifications from the Redux store.
 *
 * @param state - The root state of the Redux store.
 * @returns The list of notifications.
 */
export const selectNotifications = (state: RootState): NotificationDto[] => state.notifications.list;
/**
 * Selects the total count of notifications from the Redux store.
 *
 * @param state - The root state of the Redux store.
 * @returns The total count of notifications.
 */
export const selectNotificationsCount = (state: RootState): number => state.notifications.count;

export const { setNotifications, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;