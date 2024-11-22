import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { authApi } from "../../services/Auth.service";

export type NotifyState = {
    message: string | null;
    duration?: number;
};

const initialState: NotifyState = {
    message: null,
    duration: 3000
};

/**
 * A slice for managing notification state in the application.
 * 
 * @remarks
 * This slice includes actions for setting and clearing notifications.
 * 
 * @example
 * Dispatching a notification:
 * ```typescript
 * dispatch(setNotify({ message: "Hello, World!", duration: 3000 }));
 * ```
 * 
 * Clearing a notification:
 * ```typescript
 * dispatch(clearNotify());
 * ```
 * 
 * @public
 */
const notifySlice = createSlice({
    name: "notify",
    initialState,
    reducers: {
        /**
         * Sets the notification message and duration.
         *
         * @param state - The current state of the notify slice.
         * @param action - The action payload containing the new notification message and duration.
         * @returns The updated state with the new notification message and duration.
         */
        setNotify: (state: NotifyState, action: PayloadAction<NotifyState>) => {
            return { ...state, message: action.payload.message, duration: action.payload.duration || state.duration };
        },
        /**
         * Clears the current notification message.
         *
         * @param state - The current state of the notify slice.
         * @returns The updated state with the notification message set to null.
         */
        clearNotify: (state: NotifyState) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {

        builder.addMatcher(authApi.endpoints.saveUserData.matchFulfilled, (state: NotifyState, action: PayloadAction<any>) => {
            state.message = "MESSAGES.SUCCESS_DATA_UPDATED";
        });
        builder.addMatcher(authApi.endpoints.changePassword.matchFulfilled, (state: NotifyState, action: PayloadAction<any>) => {
            state.message = "MESSAGES.PASSWORD_SUCCESSFULLY_CHANGED";
        });
    }
});

export const selectNotify = (state: RootState): string | null => state.notify.message;
export const selectNotifyDuration = (state: RootState): number => state.notify.duration || 0;

export const { setNotify, clearNotify } = notifySlice.actions;

export default notifySlice.reducer;
