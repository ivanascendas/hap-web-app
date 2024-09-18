import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";

import { MainComponent } from "./features/main/Main.component";
import { Protected } from "./shared/components/Protected";
import { StatementComponent } from "./features/statement/Statement.component";
import { AuthComponent } from "./features/auth/Auth.component";
import { useAuth } from "./shared/providers/Auth.provider";

export const Redirect = (): JSX.Element => {
  var auth = useAuth();
  let location = useLocation();

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
    element: <AuthComponent type="login" />,
  },
  {
    path: "/resetPassword",
    element: <AuthComponent type="forgotPassword" />,
  },
  {
    index: true,
    path: "/statement",
    element: <Protected component={<StatementComponent />} />,
  },
]);
