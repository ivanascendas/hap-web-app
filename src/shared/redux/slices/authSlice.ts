import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../../models/user.model";
import { TokenDto } from "../../dtos/token.dto";
import { RootState } from "../store";

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
    setUser: (state: AuthState, action: PayloadAction<Partial<UserModel>>) => {
      return { ...state, user: { ...state.user, ...action.payload } };
    },
    setToken: (
      state: AuthState,
      action: PayloadAction<TokenDto>,
    ): AuthState => {
      return { ...state, tokenData: action.payload, tmpTokenData: null };
    },
    setTmpToken: (
      state: AuthState,
      action: PayloadAction<TokenDto>,
    ): AuthState => {
      return { ...state, tmpTokenData: action.payload };
    },
    clearUser: (state: AuthState) => {
      return { ...state, user: null };
    },
    clearToken: (state: AuthState) => {
      return { ...state, tokenData: null };
    },
    clearTmpToken: (state: AuthState) => {
      return { ...state, tmpTokenData: null };
    },
  },
});

export const selectUser = (state: RootState): UserModel | null => state.auth.user;
export const selectTmpToken = (state: RootState): TokenDto | null => state.auth.tmpTokenData;
export const selectToken = (state: RootState): TokenDto | null => state.auth.tokenData;

export const { setUser, clearUser, setTmpToken, setToken, clearTmpToken, clearToken } = userSlice.actions;

export default userSlice.reducer;
