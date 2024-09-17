import React, { createContext, Factory, useContext, useState } from "react";
import { useLoginMutation, useLogoutMutation } from "../services/Auth.service";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
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
export const AuthProvider = ({ children }: any): JSX.Element => {
  return (
    <AuthContext.Provider value={initialValue}>{children}</AuthContext.Provider>
  );
};
