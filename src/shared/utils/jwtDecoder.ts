/**
 * JWT Decoder Utility
 * Provides functions to decode and extract information from JWT tokens
 */

export interface DecodedJWT {
  [key: string]: unknown;
  exp?: number;
  iat?: number;
  role?: string | string[];
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
}

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token string
 * @returns The decoded JWT payload or null if decoding fails
 */
export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    if (!token) return null;

    // JWT has three parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT token format");
      return null;
    }

    // Get the payload (second part)
    const payload = parts[1];

    // Decode base64url to base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64 to string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Checks if the JWT token is expired
 * @param token - The JWT token string
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Extracts the role from JWT token
 * @param token - The JWT token string
 * @returns The role as string, array of strings, or null
 */
export const getRoleFromToken = (token: string): string | string[] | null => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Check different possible role claim names
  const roleClaims = [
    "role",
    "roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "Role",
    "Roles",
  ];

  for (const claim of roleClaims) {
    if (decoded[claim]) {
      return decoded[claim] as string | string[];
    }
  }

  return null;
};

/**
 * Checks if user has admin role based on JWT token
 * @param token - The JWT token string
 * @returns true if user is admin, false otherwise
 */
export const isAdminFromToken = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return false;

  // Check for admin claims
  if (decoded.isAdmin === true || decoded.IsAdmin === true) {
    return true;
  }

  const roles = getRoleFromToken(token);
  if (!roles) return false;

  if (Array.isArray(roles)) {
    return roles.some(
      (role) =>
        role.toLowerCase() === "admin" ||
        role.toLowerCase() === "administrator",
    );
  }

  return (
    roles.toLowerCase() === "admin" || roles.toLowerCase() === "administrator"
  );
};

/**
 * Checks if user has super admin role based on JWT token
 * @param token - The JWT token string
 * @returns true if user is super admin, false otherwise
 */
export const isSuperAdminFromToken = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return false;

  // Check for super admin claims
  if (decoded.isSuperAdmin === true || decoded.IsSuperAdmin === true) {
    return true;
  }

  const roles = getRoleFromToken(token);
  if (!roles) return false;

  if (Array.isArray(roles)) {
    return roles.some(
      (role) =>
        role.toLowerCase() === "superadmin" ||
        role.toLowerCase() === "super admin",
    );
  }

  return (
    roles.toLowerCase() === "superadmin" ||
    roles.toLowerCase() === "super admin"
  );
};

/**
 * Checks if user has a specific role
 * @param token - The JWT token string
 * @param requiredRole - The role to check for
 * @returns true if user has the role, false otherwise
 */
export const hasRole = (token: string, requiredRole: string): boolean => {
  const roles = getRoleFromToken(token);
  if (!roles) return false;

  if (Array.isArray(roles)) {
    return roles.some(
      (role) => role.toLowerCase() === requiredRole.toLowerCase(),
    );
  }

  return roles.toLowerCase() === requiredRole.toLowerCase();
};

/**
 * Checks if user has any of the specified roles
 * @param token - The JWT token string
 * @param requiredRoles - Array of roles to check for
 * @returns true if user has at least one of the roles, false otherwise
 */
export const hasAnyRole = (token: string, requiredRoles: string[]): boolean => {
  return requiredRoles.some((role) => hasRole(token, role));
};

/**
 * Checks if user has all of the specified roles
 * @param token - The JWT token string
 * @param requiredRoles - Array of roles to check for
 * @returns true if user has all of the roles, false otherwise
 */
export const hasAllRoles = (
  token: string,
  requiredRoles: string[],
): boolean => {
  return requiredRoles.every((role) => hasRole(token, role));
};
