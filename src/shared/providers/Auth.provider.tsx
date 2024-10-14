import React, { createContext, useContext } from "react";
import { useLoginMutation, useLogoutMutation } from "../services/Auth.service";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/slices/authSlice";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: typeof useLoginMutation;
  logout: typeof useLoginMutation;
};

const initialValue = {
  isAuthenticated: false,
  login: useLoginMutation,
  logout: useLogoutMutation,
};
// Create the context
const AuthContext = createContext<AuthContextType>(initialValue);

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const tokenData = useSelector(selectToken);

  return (
    <AuthContext.Provider value={{ ...initialValue, isAuthenticated: tokenData !== null }}>{children}</AuthContext.Provider>
  );
};
