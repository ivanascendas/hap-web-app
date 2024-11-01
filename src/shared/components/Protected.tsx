import React, { useEffect } from "react";
import { useAuth } from "../providers/Auth.provider";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { MainComponent } from "../../features/main/Main.component";

type ProtectedProps = {
  component: JSX.Element;
};
/**
 * A component that protects routes by checking authentication status.
 * If the user is not authenticated, it redirects to the login page.
 *
 * @param {ProtectedProps} props - The properties for the Protected component.
 * @param {JSX.Element} props.component - The component to render if the user is authenticated.
 * @returns {JSX.Element} The rendered component or a redirection to the login page.
 */
export const Protected = ({ component }: ProtectedProps): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isTokenRecived && !auth.isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [auth]);

  return <MainComponent>{component}</MainComponent>;
};
