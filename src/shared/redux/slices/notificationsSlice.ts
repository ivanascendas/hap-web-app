import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { notificationsApi } from "../../services/Notifications.service";

export type NotificationsState = {
    list: never[];
    unreadCount: number;
};

const initialState: NotificationsState = {
    list: [],
    unreadCount: 0
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
            return { ...state, notifications: action.payload.list };
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
    },
});


/**
 * Selects the list of notifications from the Redux store.
 *
 * @param state - The root state of the Redux store.
 * @returns The list of notifications.
 */
export const selectUnreadNotificationsCount = (state: RootState): number => state.notifications.unreadCount;

export const { setNotifications, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;