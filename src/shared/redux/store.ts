import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./slices/errorSlice";
import loaderReducer from "./slices/loaderSlice";
import userReducer from "./slices/authSlice";
import notifyReducer from "./slices/notifySlice";
import departmentsReducer from "./slices/departmentsSlice";
import staementsReducer from "./slices/statementSlice";
import paymentsReducer from "./slices/paymentSlice";
import notificationsReducer from "./slices/notificationsSlice";
import refundsReducer from "./slices/refundSlice";
import adminRefundsReducer from "./slices/adminRefundSlice";
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
import { reportsApi } from "../services/Report.service";
import { messagesApi } from "../services/Messages.service";
import { termsApi } from "../services/Terms.service";
import { refundsApi } from "../services/Refunds.service";
import { gl07BatchApi } from "../services/Gl07Batch.service";
import { configurationsApi } from "@shared/services/Configurations.service";

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
    [reportsApi.reducerPath]: reportsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [termsApi.reducerPath]: termsApi.reducer,
    [refundsApi.reducerPath]: refundsApi.reducer,
    [gl07BatchApi.reducerPath]: gl07BatchApi.reducer,
    [configurationsApi.reducerPath]: configurationsApi.reducer,
    error: errorReducer,
    department: departmentsReducer,
    loader: loaderReducer,
    auth: userReducer,
    notify: notifyReducer,
    notifications: notificationsReducer,
    statements: staementsReducer,
    payments: paymentsReducer,
    refunds: refundsReducer,
    adminRefunds: adminRefundsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in RTK Query actions
        // This is necessary for Request/Response objects and Blob data
        ignoredActionPaths: [
          "meta.arg",
          "meta.baseQueryMeta",
          "payload",
          "error",
        ],
        ignoredPaths: [
          // Ignore all API slices queries and mutations
          "authApi.queries",
          "authApi.mutations",
          "verificationApi.queries",
          "verificationApi.mutations",
          "departmentsApi.queries",
          "departmentsApi.mutations",
          "notificationsApi.queries",
          "notificationsApi.mutations",
          "statementsApi.queries",
          "statementsApi.mutations",
          "paymentsApi.queries",
          "paymentsApi.mutations",
          "customersApi.queries",
          "customersApi.mutations",
          "lettersApi.queries",
          "lettersApi.mutations",
          "adminsApi.queries",
          "adminsApi.mutations",
          "reportsApi.queries",
          "reportsApi.mutations",
          "messagesApi.queries",
          "messagesApi.mutations",
          "termsApi.queries",
          "termsApi.mutations",
          "refundsApi.queries",
          "refundsApi.mutations",
          "gl07BatchApi.queries",
          "gl07BatchApi.mutations",
        ],
      },
    }).concat(
      authApi.middleware,
      verificationApi.middleware,
      departmentsApi.middleware,
      notificationsApi.middleware,
      statementsApi.middleware,
      paymentsApi.middleware,
      customersApi.middleware,
      lettersApi.middleware,
      adminsApi.middleware,
      reportsApi.middleware,
      messagesApi.middleware,
      termsApi.middleware,
      refundsApi.middleware,
      gl07BatchApi.middleware,
      configurationsApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
