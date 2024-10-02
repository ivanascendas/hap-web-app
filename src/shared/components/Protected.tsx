import React from "react";
import { useAuth } from "../providers/Auth.provider";
import { Navigate, useLocation } from "react-router-dom";
import { MainComponent } from "../../features/main/Main.component";

type ProtectedProps = {
  component: JSX.Element;
};
export const Protected = ({ component }: ProtectedProps): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <MainComponent>{component}</MainComponent>;
};
