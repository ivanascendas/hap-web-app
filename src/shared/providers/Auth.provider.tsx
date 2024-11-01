import React, { createContext, useContext, useEffect } from "react";
import { handleToken, useLoginMutation, useLogoutMutation } from "../services/Auth.service";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../redux/slices/authSlice";
import StorageService from "../services/Storage.service";
import { TokenDto } from "../dtos/token.dto";

export type AuthContextType = {
  isTokenRecived: boolean;
  isAuthenticated: boolean;
  login: typeof useLoginMutation;
  logout: typeof useLogoutMutation;
};

const initialValue = {
  isTokenRecived: false,
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


/**
 * AuthProvider component that provides authentication context to its children.
 *
 * @param {Object} props - The props object.
 * @param {JSX.Element} props.children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthProvider component with authentication context.
 *
 * @remarks
 * This component uses Redux to dispatch actions and select the token from the state.
 * It also uses local storage to retrieve the token if it's not available in the state.
 * The `isTokenRecived` state indicates whether the token has been received and processed.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <YourComponent />
 * </AuthProvider>
 * ```
 */
export const AuthProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const dispatch = useDispatch();
  let tokenData = useSelector(selectToken);
  const [isTokenRecived, setTokenRecived] = React.useState(false);


  useEffect(() => {
    if (!tokenData) {
      tokenData = StorageService.getObject<TokenDto>("token");
      console.log(tokenData);
      if (tokenData) {
        handleToken(tokenData, dispatch);
      }
    }
    setTokenRecived(true);
  }, [tokenData]);



  return (
    <AuthContext.Provider value={{ ...initialValue, isTokenRecived, isAuthenticated: tokenData !== null }}>{children}</AuthContext.Provider>
  );
};
