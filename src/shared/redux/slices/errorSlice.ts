import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type ErrorState = {
  message: string | null;
  duration?: number;
};

const initialState: ErrorState = {
  message: null,
  duration: 3000
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state: ErrorState, action: PayloadAction<ErrorState>) => {
      return { ...state, message: action.payload.message, duration: action.payload.duration || state.duration };
    },
    clearError: (state: ErrorState) => {
      state.message = null;
    },
  },
});

export const selectError = (state: RootState): string | null => state.error.message;
export const selectErrorDuration = (state: RootState): number => state.error.duration || 0;
export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
