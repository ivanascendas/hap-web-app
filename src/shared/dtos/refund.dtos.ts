import { PaggingBaseDto } from "./pagging-base.request";

export enum PaymentMethod {
  EFT = 0,

  Cheque = 1,
}

/**
 * Status enum for refund applications
 */
export enum RefundStatus {
  Submitted,
  PendingL1,
  PendingL2,
  PendingAP,
  ReturnedForInfo,
  Approved,
  Rejected,
  Cancelled,
  Gl07Generated,
  Exported,
  Posted,
  AssignedL1,
  AssignedL2,
  AssignedAP,
}

/**
 * Document type enum
 */
export enum RefundDocumentType {
  BankHeader,
  PermissionLetter,
  Identity,
  ThirdParty,
  Cheque,
  Query,
}
export enum ApprovalAction {
  Approve,
  Reject,
  Return,
  RequestInfo,
}
/**
 * Approval step in the refund application workflow
 */
export interface ApprovalStepDto {
  level: number;
  approverName: string;
  action: ApprovalAction;
  comment?: string;
  actionAt: string;
  actorName: string;
  role: string;
}

/**
 * Data transfer object for resubmitting a refund application.
 *
 * @interface RefundApplicationResubmitDto
 * @property {string} refundReason - The reason for requesting the refund
 * @property {boolean} jointTenancy - Indicates whether the account is held in joint tenancy
 * @property {string} iban - International Bank Account Number for the refund recipient
 * @property {string} bic - Bank Identifier Code (SWIFT code) for the recipient's bank
 */
export interface RefundApplicationResubmitDto {
  refundReason: string;
  jointTenancy: boolean;
  iban: string;
  bic: string;
}

/**
 * Refund application DTO
 *     "applicationId": "559b7cdb-7f45-4588-af45-549434cf4300",
            "tenantId": "61716",
            "applicantName": "Jane Doe",
            "status": 1,
            "amount": 250.00,
            "currency": "EUR",
            "submissionChannel": "portal",
            "paymentMethod": 0,
            "referenceCode": "REF123",
            "createdAt": "2025-10-10T09:50:18.470714",
            "updatedAt": "2025-10-10T10:22:48.312468",
            "closedAt": null
 */

export interface RefundApplicationDto {
  applicationId: string;
  applicantName: string;
  tenantId: string;
  customerName: string;
  department?: string;
  incDept?: string;
  voucherNo?: string;
  sequenceNo?: string;

  // Financial details
  amount: number;
  approvedAmount?: number;
  currency: string;
  bic?: string;
  iban: string;
  trnPpsn: string;
  // Status
  status: RefundStatus;
  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
  dueBy?: Date;
  refundReason: string;
  jointTenancy: boolean;
  paymentMethod: PaymentMethod;
  referenceCode: string;
  submissionChannel: string;
  // BSH verification
  bshVerified: boolean;
  bshVerificationDate?: string;
  bshCertificateNumber?: string;

  // Contact information
  email: string;
  phone: string;
  phoneCode?: string;

  // Address
  address?: string;

  // Additional info
  reason?: string;
  adminNotes?: string;
  documents?: RefundDocumentDto[];
  approvalSteps?: ApprovalStepDto[];

  // Assignment information
  assignedToId: null;
  assignedAt: null;
  assignedLevel: null;
  isAssigned: false;
}

/**
 * Document attached to a refund application
 */
export interface RefundDocumentDto {
  documentId: string;
  docType: RefundDocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: "INVALID" | "VALID";
  uploadedAt: Date;
  storagePath: string;
}

/**
 * Create refund application request
 */
export interface CreateRefundApplicationRequest {
  tenantId: string;
  applicantName: string;
  address: string;
  trnPpsn: string;
  email: string;
  phone: string;
  refundReason: string;
  currency: string;
  amount: number;
  referenceCode: string;
  submissionChannel: string;
  jointTenancy: boolean;
  paymentMethod: PaymentMethod;
  iban: string;
  bic: string;
  dueBy: string;
}

/**
 * Update refund application request
 */
export interface UpdateRefundApplicationRequest {
  id: string;
  requestedAmount?: number;
  reason?: string;
  email?: string;
  phone?: string;
  phoneCode?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  county?: string;
  country?: string;
  zipcode?: string;
}

/**
 * Upload document request
 */
export interface UploadRefundDocumentRequest {
  applicationId: string;
  documentType: RefundDocumentType;
  file: File;
}

/**
 * Verify BSH request
 */
export interface VerifyBshRequest {
  applicationId: string;
  objectKey: string;
}

/**
 * Verify BSH response
 */
export interface VerifyBshResponse {
  documentStatus: "INVALID" | "VALID";
  extracted: {
    iban: string | null;
    bic: string | null;
    accountName: string | null;
    statementDate: string | null;
    customerAddress: string | null;
    ibanConfidence: number | null;
    isIbanLowConfidence: boolean;
    bicConfidence: number | null;
    isBicLowConfidence: boolean;
    accountNameConfidence: number | null;
    isAccountNameLowConfidence: boolean;
    statementDateConfidence: number | null;
    isStatementDateLowConfidence: boolean;
    customerAddressConfidence: number | null;
    isCustomerAddressLowConfidence: boolean;
  };
}

/**
 * Approve refund application request (admin)
 */
export interface ApproveRefundRequest {
  applicationId: string;
  approvedAmount: number;
  adminNotes?: string;
}

/**
 * Reject refund application request (admin)
 */
export interface RejectRefundRequest {
  applicationId: string;
  reason: string;
}

/**
 * GL07 report request
 */
export interface GL07ReportRequest {
  approvedApplicationIds: string[];
  createdBy: string;
}

export enum GL07Status {
  Generated,
  Exported,
  Posted,
}

/**
 * GL07 report response
 */
export interface GL07ReportResponse {
  gl07BatchId: string;
  batchNumber: string;
  status: GL07Status;
  lineCount: 1;
  createdAt: Date;
}

/**
 * Query parameters for getting refund applications
 */
export interface RefundApplicationQueryParams extends PaggingBaseDto {
  statuses?: RefundStatus[];
  department?: string;
  incDept?: string;
  tenantId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  assignedToId?: string;
}

/**
 * Response for getting refund applications
 */
export interface RefundApplicationsResponse {
  items: RefundApplicationDto[];
  count: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Admin-specific query parameters for refund applications
 */
export interface AdminApplicationQueryParams
  extends RefundApplicationQueryParams {
  assignedLevel?: 1 | 2 | 3;
}

/**
 * Request for approval action (approve/reject)
 */
export interface ApprovalActionRequest {
  level: 1 | 2 | 3;
  comment?: string;
}

/**
 * Request for requesting additional information from tenant
 */
export interface RequestInfoRequest {
  level: 1 | 2;
  comment?: string;
  dueBy: string; // ISO datetime string
}

/**
 * Request for canceling an application
 */
export interface CancelApplicationRequest {
  comment?: string;
}

/**
 * Response from approval actions
 */
export interface ApprovalActionResponse {
  applicationId: string;
  status: RefundStatus;
  message?: string;
}

/**
 * Request for confirming document status
 */
export interface ConfirmDocumentStatusRequest {
  applicationId: string;
  documentId: string;
  status: "VALID" | "INVALID";
  comment?: string;
}

/**
 * Response from confirming document status
 */
export interface ConfirmDocumentStatusResponse {
  documentId: string;
  status: string;
  confirmedAt: string;
  confirmedBy: string;
  comment?: string;
  message: string;
}

/**
 * Request for downloading a document
 */
export interface DownloadDocumentRequest {
  applicationId: string;
  documentId: string;
}

/**
 * Response for assign a refund
 */
export interface AssignRefundResponse {
  applicationId: string;
  status: RefundStatus;
  assignedToId: string;
  assignedLevel: number;
  message: string;
  actionAt: Date;
}

/**
 * Area to be redacted (blurred) in a document
 */
export interface RedactionArea {
  x: number; // pixels from left edge of source image
  y: number; // pixels from top edge of source image
  width: number;
  height: number;
}

/**
 * Request to redact (blur) a document
 */
export interface RedactDocumentRequest {
  areas: RedactionArea[];
}

/**
 * Response after redacting a document
 */
export interface RedactDocumentResponse {
  documentId: string;
  newStoragePath: string;
  createdVersionId: string | null;
  redactedAt: string; // ISO 8601 datetime
}

/**
 * Document version in version history
 */
export interface DocumentVersionDto {
  versionId: string;
  documentId: string;
  fileName: string;
  mimeType: string;
  createdAt: string; // ISO 8601 datetime
  createdBy: string;
  expiresAt: string; // ISO 8601 datetime
}
