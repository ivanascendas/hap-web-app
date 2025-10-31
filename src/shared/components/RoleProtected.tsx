import React, { useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../providers/Auth.provider";
import { useUserRole } from "../hooks/useUserRole";
import { MainComponent } from "../../features/main/main.component";
import { UserRoleName } from "@shared/dtos/admins.dtos";

export type RoleProtectedProps = {
  component: JSX.Element;
  allowedRoles?: UserRoleName[];
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  redirectTo?: string;
  fallback?: JSX.Element;
  roleRedirection?: { [key in UserRoleName]?: string };
};

/**
 * A component that protects routes by checking authentication status and user roles.
 * If the user is not authenticated, it redirects to the login page.
 * If the user doesn't have the required role, it redirects to an unauthorized page or shows a fallback.
 *
 * @param {RoleProtectedProps} props - The properties for the RoleProtected component.
 * @param {JSX.Element} props.component - The component to render if the user is authenticated and authorized.
 * @param {string[]} [props.allowedRoles] - Array of allowed role names. User must have at least one of these roles.
 * @param {boolean} [props.requireAdmin] - If true, requires user to be an admin.
 * @param {boolean} [props.requireSuperAdmin] - If true, requires user to be a super admin.
 * @param {string} [props.redirectTo] - Custom redirect path for unauthorized users. Defaults to '/unauthorized'.
 * @param {JSX.Element} [props.fallback] - Custom fallback component for unauthorized users.
 * @returns {JSX.Element} The rendered component, a redirection, or a fallback.
 */
export const RoleProtected = ({
  component,
  allowedRoles,
  requireAdmin = false,
  requireSuperAdmin = false,
  redirectTo = "/unauthorized",
  fallback,
  roleRedirection,
}: RoleProtectedProps): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = useUserRole();
  console.log("UserRole in RoleProtected:", {
    allowedRoles,
    requireAdmin,
    requireSuperAdmin,
    redirectTo,
    fallback,
  });
  // First, check authentication
  useEffect(() => {
    if (auth.isTokenRecived && !auth.isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [auth, navigate, location]);

  // If not authenticated yet, return empty fragment while waiting
  if (!auth.isAuthenticated) {
    return <></>;
  }

  // Check role-based authorization
  const isAuthorized = (): boolean => {
    // Super admin check
    if (requireSuperAdmin) {
      return userRole.isSuperAdmin;
    }

    // Admin check (includes super admin)
    if (requireAdmin) {
      return userRole.isAdmin || userRole.isSuperAdmin;
    }
    let isAllowedRole = false;
    // Specific roles check
    if (allowedRoles && allowedRoles.length > 0) {
      isAllowedRole =
        userRole.hasAnyRole(allowedRoles) || userRole.isSuperAdmin;
    }

    if (!isAllowedRole && roleRedirection) {
      return userRole.hasAnyRole(
        Object.keys(roleRedirection) as UserRoleName[],
      );
    }

    if (!isAllowedRole) {
      return false;
    }

    // No specific role requirements - allow if authenticated
    return true;
  };

  // If not authorized, show fallback or redirect
  if (!isAuthorized()) {
    if (fallback) {
      return <MainComponent>{fallback}</MainComponent>;
    }
    console.log("Redirecting to", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roleRedirection) {
    for (const role in roleRedirection) {
      if (
        userRole.hasRole(role as UserRoleName) &&
        !allowedRoles?.includes(role as UserRoleName)
      ) {
        const path = roleRedirection[role as UserRoleName];
        if (path && location.pathname !== path) {
          console.log("Redirecting based on role to", path);
          return <Navigate to={path} state={{ from: location }} replace />;
        }
      }
    }
  }

  return <>{component}</>;
};
