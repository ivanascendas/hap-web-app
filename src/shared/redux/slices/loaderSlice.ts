import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";
import { authApi } from "../../services/Auth.service";

export type loaderState = {
  isLoading: boolean;
  isUserLoading: boolean;
  percent?: number;
  pendingRequests: number;
  pendingUserRequests: number;
};

const initialState: loaderState = {
  isLoading: false,
  isUserLoading: false,
  pendingRequests: 0,
  pendingUserRequests: 0,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setloading: (state: loaderState, action: PayloadAction<boolean>) => {
      return { ...state, isLoading: action.payload };
    },
    setPercent: (state: loaderState, action: PayloadAction<number>) => {
      return { ...state, percent: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.pendingRequests++;
          state.isLoading = true;
        },
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected"),
        (state) => {
          state.pendingRequests--;
          state.isLoading = state.pendingRequests > 0;
        },
      )
      .addMatcher(authApi.endpoints.userdata.matchPending, (state) => {
        state.pendingUserRequests++;
        state.isUserLoading = true;
      })
      .addMatcher(authApi.endpoints.checkValidContact.matchPending, (state) => {
        state.pendingUserRequests++;
        state.isUserLoading = true;
      })
      .addMatcher(
        authApi.endpoints.checkValidContact.matchFulfilled,
        (state) => {
          state.pendingUserRequests--;
          state.isUserLoading = state.pendingUserRequests > 0;
        },
      )
      .addMatcher(authApi.endpoints.userdata.matchFulfilled, (state) => {
        state.pendingUserRequests--;
        state.isUserLoading = state.pendingUserRequests > 0;
      })
      .addMatcher(
        authApi.endpoints.checkValidContact.matchRejected,
        (state) => {
          state.pendingUserRequests--;
          state.isUserLoading = state.pendingUserRequests > 0;
        },
      )
      .addMatcher(authApi.endpoints.userdata.matchRejected, (state) => {
        state.pendingUserRequests--;
        state.isUserLoading = state.pendingUserRequests > 0;
      });
  },
});

//export const { setloading, setPercent } = loaderSlice.actions;

export const selectLoading = (state: { loader: loaderState }) =>
  state.loader.isLoading;
export const selectUserLoading = (state: { loader: loaderState }) =>
  state.loader.isUserLoading;

export default loaderSlice.reducer;
