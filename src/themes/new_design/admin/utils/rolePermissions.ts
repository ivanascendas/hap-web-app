import { UserModel } from "@shared/models/user.model";
import { RefundStatus } from "@shared/dtos/refund.dtos";

/**
 * Action types for refund application management
 */
export type ActionType =
  | "approveL1"
  | "approveL2"
  | "approveL3"
  | "rejectL1"
  | "rejectL2"
  | "rejectL3"
  | "requestInfoL1"
  | "requestInfoL2"
  | "cancel"
  | "view";

/**
 * Checks if a user has permission to perform a specific action on a refund application
 *
 * @param action - The action type to check permission for
 * @param user - The user model with role information (isAdmin, isSuperAdmin)
 * @param status - The current status of the refund application
 * @returns True if the user has permission, false otherwise
 *
 * @remarks
 * Permission rules:
 * - isAdmin (DMU): Can approve/reject/request info at L1 and L2
 * - isSuperAdmin (AP): Can approve/reject at L3
 * - Both roles can cancel applications before Gl07Generated
 *
 * @example
 * ```typescript
 * const user = useSelector(selectUser);
 * const canApprove = hasPermission('approveL1', user, RefundStatus.PendingL1);
 * ```
 */
export const hasPermission = (
  action: ActionType,
  user: UserModel | null,
  status: RefundStatus,
): boolean => {
  if (!user) return false;

  const finalStatuses = [
    RefundStatus.Gl07Generated,
    RefundStatus.Exported,
    RefundStatus.Posted,
  ];

  switch (action) {
    // DMU Level 1 actions
    case "approveL1":
      return !!user.isAdmin && status === RefundStatus.PendingL1;

    case "rejectL1":
      return !!user.isAdmin && status === RefundStatus.PendingL1;

    case "requestInfoL1":
      return !!user.isAdmin && status === RefundStatus.PendingL1;

    // DMU Level 2 actions
    case "approveL2":
      return !!user.isAdmin && status === RefundStatus.PendingL2;

    case "rejectL2":
      return !!user.isAdmin && status === RefundStatus.PendingL2;

    case "requestInfoL2":
      return !!user.isAdmin && status === RefundStatus.PendingL2;

    // AP Level 3 actions
    case "approveL3":
      return !!user.isSuperAdmin && status === RefundStatus.PendingAP;

    case "rejectL3":
      return !!user.isSuperAdmin && status === RefundStatus.PendingAP;

    // Cancel action (available to all admin roles before final statuses)
    case "cancel":
      return (
        (!!user.isAdmin || !!user.isSuperAdmin) &&
        !finalStatuses.includes(status)
      );

    // View action (all admins can view)
    case "view":
      return !!user.isAdmin || !!user.isSuperAdmin;

    default:
      return false;
  }
};

/**
 * Gets the appropriate approval level for a user based on the application status
 *
 * @param user - The user model with role information
 * @param status - The current status of the refund application
 * @returns The level (1, 2, or 3) or null if no level is applicable
 *
 * @example
 * ```typescript
 * const level = getUserApprovalLevel(user, RefundStatus.PendingL1); // Returns 1
 * ```
 */
export const getUserApprovalLevel = (
  user: UserModel | null,
  status: RefundStatus,
): 1 | 2 | 3 | null => {
  if (!user) return null;

  if (user.isAdmin) {
    if (status === RefundStatus.PendingL1) return 1;
    if (status === RefundStatus.PendingL2) return 2;
  }

  if (user.isSuperAdmin) {
    if (status === RefundStatus.PendingAP) return 3;
  }

  return null;
};

/**
 * Checks if a user can perform any action on a refund application
 *
 * @param user - The user model with role information
 * @param status - The current status of the refund application
 * @returns True if the user can perform at least one action
 *
 * @example
 * ```typescript
 * const canAct = canPerformAnyAction(user, status);
 * if (canAct) {
 *   // Show action buttons
 * }
 * ```
 */
export const canPerformAnyAction = (
  user: UserModel | null,
  status: RefundStatus,
): boolean => {
  if (!user) return false;

  const actions: ActionType[] = [
    "approveL1",
    "approveL2",
    "approveL3",
    "rejectL1",
    "rejectL2",
    "rejectL3",
    "requestInfoL1",
    "requestInfoL2",
    "cancel",
  ];

  return actions.some((action) => hasPermission(action, user, status));
};
