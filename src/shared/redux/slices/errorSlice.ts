import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ErrorState = {
  error: string | null;
};

const initialState: ErrorState = {
  error: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state: ErrorState, action: PayloadAction<string>) => {
      return { ...state, error: action.payload };
    },
    clearError: (state: ErrorState) => {
      state.error = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
