import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../../models/user.model";
import { TokenDto } from "../../dtos/token.dto";
import { RootState } from "../store";

export type AuthState = {
  user: UserModel | null;
  tokenData: TokenDto | null;
};

const initialState: AuthState = {
  user: null,
  tokenData: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<Partial<UserModel>>) => {
      return { ...state, user: { ...state.user, ...action.payload } };
    },
    setToken: (
      state: AuthState,
      action: PayloadAction<TokenDto>,
    ): AuthState => {
      return { ...state, tokenData: action.payload };
    },
    clearUser: (state: AuthState) => {
      return { ...state, user: null };
    },
    clearToken: (state: AuthState) => {
      return { ...state, tokenData: null };
    },
  },
});

export const selectUser = (state: RootState) => state.auth.user || {};

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
