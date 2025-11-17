import { RefundStatus, RefundDocumentType } from "@shared/dtos/refund.dtos";

/**
 * Color configuration for refund statuses
 */
export interface StatusColor {
  color: string;
  backgroundColor?: string;
}

/**
 * Gets the display label for a refund status
 *
 * @param status - The refund status enum value
 * @returns A user-friendly label for the status
 *
 * @example
 * ```typescript
 * const label = getStatusLabel(RefundStatus.PendingL1); // Returns "Pending L1 Approval"
 * ```
 */
export const getStatusLabel = (status: RefundStatus): string => {
  const labels: Record<RefundStatus, string> = {
    [RefundStatus.Submitted]: "Submitted",
    [RefundStatus.PendingL1]: "Pending L1 ",
    [RefundStatus.PendingL2]: "Pending L2 ",
    [RefundStatus.PendingAP]: "Pending AP ",
    [RefundStatus.ReturnedForInfo]: "Returned for Information",
    [RefundStatus.Approved]: "Approved",
    [RefundStatus.Rejected]: "Rejected",
    [RefundStatus.Cancelled]: "Cancelled",
    [RefundStatus.Gl07Generated]: "GL07 Generated",
    [RefundStatus.Exported]: "Exported",
    [RefundStatus.Posted]: "Posted",
    [RefundStatus.AssignedL1]: "Assigned L1",
    [RefundStatus.AssignedL2]: "Assigned L2",
    [RefundStatus.AssignedAP]: "Assigned AP",
  };

  return labels[status] || "Unknown Status";
};

/**
 * Gets the color configuration for a refund status badge
 *
 * @param status - The refund status enum value
 * @returns Color configuration object with color and optional backgroundColor
 *
 * @example
 * ```typescript
 * const { color } = getStatusColor(RefundStatus.Approved);
 * // Returns { color: '#2e7d32' }
 * ```
 */
export const getStatusColor = (status: RefundStatus): StatusColor => {
  const colors: Record<RefundStatus, StatusColor> = {
    [RefundStatus.Submitted]: { color: "#1976d2" }, // info blue
    [RefundStatus.PendingL1]: { color: "#ed6c02" }, // warning orange
    [RefundStatus.PendingL2]: { color: "#ed6c02" }, // warning orange
    [RefundStatus.PendingAP]: { color: "#ed6c02" }, // warning orange
    [RefundStatus.ReturnedForInfo]: { color: "#0288d1" }, // info light blue
    [RefundStatus.Approved]: { color: "#2e7d32" }, // success green
    [RefundStatus.Rejected]: { color: "#d32f2f" }, // error red
    [RefundStatus.Cancelled]: { color: "#d32f2f" }, // error red
    [RefundStatus.Gl07Generated]: { color: "#757575" }, // grey
    [RefundStatus.Exported]: { color: "#757575" }, // grey
    [RefundStatus.Posted]: { color: "#2e7d32" }, // success green
    [RefundStatus.AssignedL1]: { color: "#1976d2" }, // info blue
    [RefundStatus.AssignedL2]: { color: "#1976d2" }, // info blue
    [RefundStatus.AssignedAP]: { color: "#1976d2" }, // info blue
  };

  return colors[status] || { color: "#757575" };
};

/**
 * Gets the display label for a document type
 *
 * @param docType - The document type enum value
 * @returns A user-friendly label for the document type
 *
 * @example
 * ```typescript
 * const label = getDocumentTypeLabel(RefundDocumentType.BankHeader);
 * // Returns "Bank Statement Header"
 * ```
 */
export const getDocumentTypeLabel = (docType: RefundDocumentType): string => {
  const labels: Record<RefundDocumentType, string> = {
    [RefundDocumentType.BankHeader]: "Bank Statement Header",
    [RefundDocumentType.PermissionLetter]: "Permission Letter",
    [RefundDocumentType.Identity]: "Identity Document",
    [RefundDocumentType.ThirdParty]: "Third Party Document",
    [RefundDocumentType.Cheque]: "Cheque",
    [RefundDocumentType.Query]: "Query Document",
  };

  return labels[docType] || "Unknown Document";
};

/**
 * Formats a currency amount with the specified currency code
 *
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'EUR', 'USD')
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(250.50, 'EUR'); // Returns "€250.50"
 * ```
 */
export const formatCurrency = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: currency || "EUR",
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Formats a date string to a user-friendly format
 *
 * @param dateString - The date string to format (ISO format)
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * const formatted = formatDate('2025-10-10T09:50:18');
 * // Returns "10 Oct 2025, 09:50"
 * ```
 */
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return String(dateString);
  }
};

/**
 * Checks if a status is a final status (no further actions possible)
 *
 * @param status - The refund status to check
 * @returns True if the status is final
 *
 * @example
 * ```typescript
 * const isFinal = isFinalStatus(RefundStatus.Posted); // Returns true
 * ```
 */
export const isFinalStatus = (status: RefundStatus): boolean => {
  const finalStatuses = [
    RefundStatus.Rejected,
    RefundStatus.Cancelled,
    RefundStatus.Gl07Generated,
    RefundStatus.Exported,
    RefundStatus.Posted,
  ];

  return finalStatuses.includes(status);
};
