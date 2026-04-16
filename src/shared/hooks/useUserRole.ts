import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "../redux/slices/authSlice";
import {
  getRoleFromToken,
  isAdminFromToken,
  isSuperAdminFromToken,
  hasRole,
  hasAnyRole,
  hasAllRoles,
} from "../utils/jwtDecoder";
import { UserRoleName } from "@shared/dtos/admins.dtos";

export type UserRole = {
  roles: string | string[] | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isUser: boolean;
  hasRole: (role: UserRoleName) => boolean;
  hasAnyRole: (roles: UserRoleName[]) => boolean;
  hasAllRoles: (roles: UserRoleName[]) => boolean;
};

/**
 * Hook to access user role information from JWT token and user state
 * @returns UserRole object with role information and utility functions
 */
export const useUserRole = (): UserRole => {
  const tokenData = useSelector(selectToken);
  const userData = useSelector(selectUser);

  const userRole = useMemo<UserRole>(() => {
    const token = tokenData?.access_token;

    if (!token) {
      return {
        roles: null,
        isAdmin: false,
        isSuperAdmin: false,
        isUser: false,
        hasRole: () => false,
        hasAnyRole: () => false,
        hasAllRoles: () => false,
      };
    }

    // Extract roles from JWT token
    const roles = getRoleFromToken(token);
    const isAdminFromJWT = isAdminFromToken(token);
    const isSuperAdminFromJWT = isSuperAdminFromToken(token);

    // Also check user data from state (if available)
    const isAdminFromState = userData?.isAdmin === true;
    const isSuperAdminFromState = userData?.isSuperAdmin === true;

    // Combine both sources
    const isAdmin = isAdminFromJWT || isAdminFromState;
    const isSuperAdmin = isSuperAdminFromJWT || isSuperAdminFromState;
    const isUser = !isAdmin && !isSuperAdmin;

    return {
      roles,
      isAdmin,
      isSuperAdmin,
      isUser,
      hasRole: (role: UserRoleName) => hasRole(token, role),
      hasAnyRole: (requiredRoles: UserRoleName[]) =>
        hasAnyRole(token, requiredRoles),
      hasAllRoles: (requiredRoles: UserRoleName[]) =>
        hasAllRoles(token, requiredRoles),
    };
  }, [tokenData, userData]);

  return userRole;
};
