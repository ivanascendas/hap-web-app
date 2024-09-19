import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type loaderState = {
  isLoading: boolean;
  percent?: number;
};

const initialState: loaderState = {
  isLoading: false,
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
});

export const { setloading, setPercent } = loaderSlice.actions;

export default loaderSlice.reducer;
