import { UserModel } from "@shared/models/user.model";
import { RefundApplicationDto, RefundStatus } from "@shared/dtos/refund.dtos";

/**
 * Action types for refund application management
 */
export type ActionType =
  | "approveL1"
  | "approveL2"
  | "approveL3"
  | "assignL1"
  | "assignL2"
  | "assignL3"
  | "rejectL1"
  | "rejectL2"
  | "rejectL3"
  | "requestInfoL1"
  | "requestInfoL2"
  | "unassign"
  | "reassign"
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
  application: RefundApplicationDto,
): boolean => {
  if (!user) return false;
  const { status, assignedToId, isAssigned } = application;
  const finalStatuses = [
    RefundStatus.Gl07Generated,
    RefundStatus.Exported,
    RefundStatus.Posted,
  ];

  switch (action) {
    case "assignL1":
      return !!user.isAdmin && !isAssigned && status === RefundStatus.PendingL1;
    case "assignL2":
      // Assignment actions are not handled here
      return !!user.isAdmin && !isAssigned && status === RefundStatus.PendingL2;
    case "assignL3":
      // Assignment actions are not handled here
      return !!user.isAdmin && !isAssigned && status === RefundStatus.PendingAP;
    // DMU Level 1 actions
    case "approveL1":
      return (
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedL1 ||
            status === RefundStatus.PendingL1)) ||
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedL1 &&
          user.customerNo === assignedToId)
      );
    case "unassign":
      return (
        (!!user.isAdmin && isAssigned && user.customerNo === assignedToId) ||
        !!user.isSuperAdmin
      );

    case "rejectL1":
      return (
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedL1 &&
          user.customerNo === assignedToId) ||
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedL1 ||
            status === RefundStatus.PendingL1))
      );

    case "requestInfoL1":
      return (
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedL1 &&
          user.customerNo === assignedToId) ||
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedL1 ||
            status === RefundStatus.PendingL1))
      );

    // DMU Level 2 actions
    case "approveL2":
      return (
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedL2 &&
          user.customerNo === assignedToId) ||
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedL2 ||
            status === RefundStatus.PendingL2))
      );

    case "rejectL2":
      return (
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedL2 &&
          user.customerNo === assignedToId) ||
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedL2 ||
            status === RefundStatus.PendingL2))
      );

    case "requestInfoL2":
      return (
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedL2 &&
          user.customerNo === assignedToId) ||
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedL2 ||
            status === RefundStatus.PendingL2))
      );

    // AP Level 3 actions
    case "approveL3":
      return (
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedAP &&
          user.customerNo === assignedToId) ||
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedAP ||
            status === RefundStatus.PendingAP))
      );

    case "rejectL3":
      return (
        (!!user.isAdmin &&
          isAssigned &&
          status === RefundStatus.AssignedAP &&
          user.customerNo === assignedToId) ||
        (!!user.isSuperAdmin &&
          (status === RefundStatus.AssignedAP ||
            status === RefundStatus.PendingAP))
      );

    // Cancel action (available to all admin roles before final statuses)
    case "cancel":
      return (
        (((!!user.isAdmin && user.customerNo === assignedToId) ||
          !!user.isSuperAdmin) &&
          !finalStatuses.includes(status)) ||
        (!!user.isSuperAdmin && !finalStatuses.includes(status))
      );
    case "reassign":
      return !!user.isSuperAdmin && isAssigned;

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
    if (status === RefundStatus.PendingL1 || status === RefundStatus.AssignedL1)
      return 1;
    if (status === RefundStatus.PendingL2 || status === RefundStatus.AssignedL2)
      return 2;
  }

  if (user.isSuperAdmin) {
    if (status === RefundStatus.PendingAP || status === RefundStatus.AssignedAP)
      return 3;
  }

  return null;
};

/**
 * Checks if a user can perform any action on a refund application
 *
 * @param user - The user model with role information
 * @param application - The refund application
 * @returns True if the user can perform at least one action
 *
 * @example
 * ```typescript
 * const canAct = canPerformAnyAction(user, application);
 * if (canAct) {
 *   // Show action buttons
 * }
 * ```
 */
export const canPerformAnyAction = (
  user: UserModel | null,
  application: RefundApplicationDto,
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

  return actions.some((action) => hasPermission(action, user, application));
};
