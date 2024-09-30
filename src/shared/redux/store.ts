import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./slices/errorSlice";
import loaderReducer from "./slices/loaderSlice";
import userReducer from "./slices/authSlice";
import { authApi } from "../services/Auth.service";
import { setupListeners } from "@reduxjs/toolkit/query";
import { verificationApi } from "../services/Verification.service";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [verificationApi.reducerPath]: verificationApi.reducer,
    error: errorReducer,
    loader: loaderReducer,
    auth: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      verificationApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
