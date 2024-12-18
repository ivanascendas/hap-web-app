import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";

import { Protected } from "./shared/components/Protected";
import { StatementComponent } from "./features/statement/Statement.component";
import { useAuth } from "./shared/providers/Auth.provider";
import { LoginFormComponent } from "./features/auth/components/LoginForm.component";
import { ForgotPasswordFormComponent } from "./features/auth/components/ForgotPasswordForm.component";
import { RegistrationComponent } from "./features/auth/components/Registration.components";
import { ResetPasswordComponent } from "./features/auth/components/ResetPassword.component";
import { CookieComponent } from "./features/cookie/cookie.component";
import { DataComponent } from "./features/cookie/data.component";
import { AccountComponent } from "./features/account/Account.component";
import { MessagesComponent } from "./features/messages/Messages.component";
import { ContactsComponent } from "./features/contacts/Contacts.component";
import { InvoicesComponent } from "./features/invoices/Invoices.component";
import { PaymentComponent } from "./features/payment/payment.component";
import { PayComponent } from "./features/payment/pay.component";

/**
 * Redirect component that handles user authentication and navigation.
 *
 * This component checks if the user is authenticated using the `useAuth` hook.
 * If the user is not authenticated, it redirects them to the login page.
 * If the user is authenticated, it redirects them to the statements/rates page.
 *
 * @returns {JSX.Element} A <Navigate> component that redirects the user based on their authentication status.
 */
export const Redirect = (): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return (
      <Navigate to="/statements/rates" state={{ from: location }} replace />
    );
  }
};

/**
 * Defines the routes for the application using `createBrowserRouter`.
 *
 * Routes:
 * - `/`: Redirects to another route.
 * - `/login`: Displays the login form.
 * - `/resetPassword`: Displays the forgot password form.
 * - `/reset`: Displays the reset password component.
 * - `/registration/:step`: Displays the registration component with a dynamic step parameter.
 * - `/cookie`: Displays the cookie component.
 * - `/data`: Displays the data component.
 * - `/statements/:department`: Displays the statement component for a specific department, protected route.
 * - `/account`: Displays the account component, protected route.
 * - `/messages`: Displays the messages component, protected route.
 * - `/contacts`: Displays the contacts component, protected route.
 */
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
    path: "/reset",
    element: <ResetPasswordComponent />,
  },
  {
    path: "/registration/:step",
    element: <RegistrationComponent />,
  },
  {
    path: "/cookie",
    element: <CookieComponent />,
  },
  {
    path: "/data",
    element: <DataComponent />,
  },
  {
    index: true,
    path: "/statements/:department",
    element: <Protected component={<StatementComponent />} />,
  },

  {
    path: "/invoices/:department",
    element: <Protected component={<InvoicesComponent />} />,
  },
  {
    path: "/account",
    element: <Protected component={<AccountComponent />} />,
  },
  {
    path: "/messages",
    element: <Protected component={<MessagesComponent />} />,
  },
  {
    path: "/contacts",
    element: <Protected component={<ContactsComponent />} />,
  },
  {
    path: "/payment/info",
    element: <Protected component={<PaymentComponent />} />,
  },
  {
    path: "/payment/pay",
    element: <Protected component={<PayComponent />} />,
  },
]);
