import React from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { Protected } from "@shared/components/Protected";
import { StatementComponent } from "@components/statement/Statement.component";
import { useAuth } from "./shared/providers/Auth.provider";
import { LoginFormComponent } from "@components/auth/components/LoginForm.component";
import { ForgotPasswordFormComponent } from "@components/auth/components/ForgotPasswordForm.component";
import { RegistrationComponent } from "@components/auth/components/Registration.components";
import { ResetPasswordComponent } from "@components/auth/components/ResetPassword.component";
import { CookieComponent } from "@components/cookie/cookie.component";
import { DataComponent } from "@components/cookie/data.component";
import { AccountComponent } from "@components/account/Account.component";
import { MessagesComponent } from "@components/messages/Messages.component";
import { ContactsComponent } from "@components/contacts/Contacts.component";
import { InvoicesComponent } from "@components/invoices/Invoices.component";
import { PaymentComponent } from "@components/payment/payment.component";
import { PayComponent } from "@components/payment/pay.component";
import { AdminComponent } from "@components/admin/admin.component";
import { UsersComponent } from "@components/admin/pages/users.component";
import { LettersComponent } from "@components/admin/pages/letters.component";
import { ReportsComponent } from "@components/admin/pages/reports.component";
import { AdminNotificationsComponent } from "@components/admin/pages/notifications.component";
import { AdminsComponent } from "@components/admin/pages/admins.component";
import { PasswordComponent } from "@components/admin/pages/password.component";
import { AdminMessagesComponent } from "@components/admin/pages/messages.component";
import { TermsComponent } from "@components/admin/pages/terms.copmonent";

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
    element: <LoginFormComponent successUrl={"/statements/rates"} />,
  },

  {
    path: "/loginAdmin",
    element: <LoginFormComponent successUrl={"/admin/users"} />,
  },
  {
    path: "/admin",
    element: <AdminComponent />,
    children: [
      {
        index: true,
        path: "users",
        element: <UsersComponent />,
      },
      {
        path: "letters/:type",
        element: <LettersComponent />,
      },
      {
        path: "reports",
        element: <ReportsComponent />,
      },
      {
        path: "notifications/:type",
        element: <AdminNotificationsComponent />,
      },
      {
        path: "admins",
        element: <AdminsComponent />,
      },
      {
        path: "security",
        element: <PasswordComponent />,
      },
      {
        path: "messages",
        element: <AdminMessagesComponent />,
      },
      {
        path: "terms",
        element: <TermsComponent />,
      },
    ],
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
