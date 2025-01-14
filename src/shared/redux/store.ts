import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./slices/errorSlice";
import loaderReducer from "./slices/loaderSlice";
import userReducer from "./slices/authSlice";
import notifyReducer from "./slices/notifySlice";
import departmentsReducer from "./slices/departmentsSlice";
import staementsReducer from "./slices/statementSlice";
import paymentsReducer from "./slices/paymentSlice";
import notificationsReducer from "./slices/notificationsSlice";
import { authApi } from "../services/Auth.service";
import { setupListeners } from "@reduxjs/toolkit/query";
import { verificationApi } from "../services/Verification.service";
import { departmentsApi } from "../services/Department.service";
import { notificationsApi } from "../services/Notifications.service";
import { statementsApi } from "../services/Statements.service";
import { paymentsApi } from "../services/Payment.service";
import { customersApi } from "../services/Customers.service";
import { lettersApi } from "../services/Letters.service";
import { adminsApi } from "../services/Admins.service";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [verificationApi.reducerPath]: verificationApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [statementsApi.reducerPath]: statementsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [lettersApi.reducerPath]: lettersApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    error: errorReducer,
    department: departmentsReducer,
    loader: loaderReducer,
    auth: userReducer,
    notify: notifyReducer,
    notifications: notificationsReducer,
    statements: staementsReducer,
    payments: paymentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      verificationApi.middleware,
      departmentsApi.middleware,
      notificationsApi.middleware,
      statementsApi.middleware,
      paymentsApi.middleware,
      customersApi.middleware,
      lettersApi.middleware,
      adminsApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
