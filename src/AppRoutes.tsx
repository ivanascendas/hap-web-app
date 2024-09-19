import React from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";

import { Protected } from "./shared/components/Protected";
import { StatementComponent } from "./features/statement/Statement.component";
import { useAuth } from "./shared/providers/Auth.provider";
import { LoginFormComponent } from "./features/auth/components/LoginForm.component";
import { ForgotPasswordFormComponent } from "./features/auth/components/ForgotPasswordForm.component";

export const Redirect = (): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/statement" state={{ from: location }} replace />;
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Redirect />,
  },
  {
    path: "/login",
    element: <LoginFormComponent />,
  },
  {
    path: "/resetPassword",
    element: <ForgotPasswordFormComponent />,
  },
  {
    index: true,
    path: "/statement",
    element: <Protected component={<StatementComponent />} />,
  },
]);
