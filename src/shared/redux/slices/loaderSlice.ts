import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type loaderState = {
  isLoading: boolean;
  percent?: number;
  pendingRequests: number;
};

const initialState: loaderState = {
  isLoading: false,
  pendingRequests: 0,
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
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.pendingRequests++;
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
        (state) => {
          state.pendingRequests--;
          state.isLoading = state.pendingRequests > 0;
        }
      );
  },
});

//export const { setloading, setPercent } = loaderSlice.actions;

export const selectLoading = (state: { loader: loaderState }) => state.loader.isLoading;

export default loaderSlice.reducer;
