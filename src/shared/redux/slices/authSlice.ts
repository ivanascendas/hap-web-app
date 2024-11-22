import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../../models/user.model";
import { TokenDto } from "../../dtos/token.dto";
import { RootState } from "../store";
import localStorageService from "../../services/Storage.service";
import { authApi } from "../../services/Auth.service";

export type AuthState = {
  user: UserModel | null;
  tmpTokenData: TokenDto | null;
  tokenData: TokenDto | null;
};

const initialState: AuthState = {
  user: null,
  tmpTokenData: null,
  tokenData: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Updates the user state in the auth slice with the provided partial user data.
     * @param state - The current auth state.
     * @param action - The action payload containing the partial user data to update.
     */
    setUser: (state, action: PayloadAction<Partial<UserModel>>) => {
      state.user = { ...state.user, ...action.payload } as UserModel;
    },
    /**
     * Updates the token data in the auth state and stores the token in local storage.
     * @param state - The current auth state.
     * @param action - The action payload containing the new token data to update.
     */
    setToken: (state, action: PayloadAction<TokenDto>) => {
      console.log(action.payload);
      localStorageService.setItem('token', JSON.stringify(action.payload));
      state.tokenData = action.payload;
      state.tmpTokenData = null;
    },
    /**
     * Updates the temporary token data in the auth state.
     * @param state - The current auth state.
     * @param action - The action payload containing the new temporary token data to update.
     */
    setTmpToken: (state, action: PayloadAction<TokenDto>) => {
      state.tmpTokenData = action.payload;
    },
    /**
     * Clears the user data from the auth state.
     * @param state - The current auth state.
     */
    clearUser: (state) => {
      state.user = null;
    },
    /**
     * Clears the token data from the auth state and removes the token from local storage.
     * @param state - The current auth state.
     */
    clearToken: (state) => {
      console.log("clearToken");
      localStorageService.removeItem('token');
      state.tokenData = null;
    },
    /**
     * Clears the temporary token data from the auth state.
     * @param state - The current auth state.
     */
    clearTmpToken: (state) => {
      state.tmpTokenData = null;
    },
  }, extraReducers: (builder) => {

    /** Handles the fulfilled action from the `getUserData` API endpoint. */
    builder.addMatcher(authApi.endpoints.userdata.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
    /** Handles the rejected action from the `getUserData` API endpoint. */
    builder.addMatcher(authApi.endpoints.userdata.matchRejected, (state, action) => {

      if ((action.payload as any)?.data?.status === 401) {
        localStorageService.removeItem('token');
        state.user = null;
        state.tokenData = null;
        state.tmpTokenData = null;
      }
    });
    /** Handles the fulfilled action from the `logout` API endpoint. */
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state, action) => {
      localStorageService.removeItem('token');
      state.user = null;
      state.tokenData = null;
      state.tmpTokenData = null;
    });

    /** Handles the rejected action from the `logout` API endpoint. */
    builder.addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {

      if ((action.payload as any)?.data?.status === 401) {
        localStorageService.removeItem('token');
        state.user = null;
        state.tokenData = null;
        state.tmpTokenData = null;
      }
    });

    /** Handles the fulfilled action from the `checkValidContact` API endpoint. */
    builder.addMatcher(authApi.endpoints.checkValidContact.matchFulfilled, (state, action) => {
      state.user = {
        ...state.user,
        defaultMFA: action.payload.defaultMFA,
        emailConfirmed: action.payload.isEmailConfirmed,
        phoneNumberConfirmed: action.payload.isPhoneConfirmed
      } as UserModel;
    });


  }
});
export const selectUser = (state: RootState): UserModel | null => state.auth.user;
export const selectTmpToken = (state: RootState): TokenDto | null => state.auth.tmpTokenData;
export const selectToken = (state: RootState): TokenDto | null => state.auth.tokenData;

export const { setUser, clearUser, setTmpToken, setToken, clearTmpToken, clearToken } = userSlice.actions;

export default userSlice.reducer;
