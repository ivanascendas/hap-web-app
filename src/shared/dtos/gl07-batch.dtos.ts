import { PaymentMethod } from "./refund.dtos";

// Gl07 Batch Status Enum
export enum Gl07BatchStatus {
  Generated = 0,
  Exported = 1,
  Posted = 2,
}

// Gl07 Batch Status Display Names
export const Gl07BatchStatusLabels: Record<Gl07BatchStatus, string> = {
  [Gl07BatchStatus.Generated]: "Generated",
  [Gl07BatchStatus.Exported]: "Exported",
  [Gl07BatchStatus.Posted]: "Posted",
};

// Gl07 Line DTO
export interface Gl07LineDto {
  gl07LineId: string;
  applicationId: string;
  sundrySupplierId: string;
  name: string;
  address: string;
  trn: string;
  bankIban: string | null;
  bankBic: string | null;
  amount: number;
  referenceCode: string;
}

// Gl07 Batch List Item DTO (for list view)
export interface Gl07BatchListItemDto {
  gl07BatchId: string;
  batchNumber: string;
  status: Gl07BatchStatus;
  createdBy: string;
  createdAt: string;
  postedAt: string | null;
  lineCount: number;
}

// Gl07 Batch DTO (full details)
export interface Gl07BatchDto {
  gl07BatchId: string;
  batchNumber: string;
  status: Gl07BatchStatus;
  filePath: string;
  createdBy: string;
  createdAt: string;
  postedAt: string | null;
  lines: Gl07LineDto[];
}

// Refund Application List Item DTO (for approved applications selection)
export interface RefundApplicationListItemDto {
  applicationId: string;
  tenantId: string;
  applicantName: string;
  status: string;
  amount: number;
  currency: string;
  submissionChannel: string;
  paymentMethod: PaymentMethod;
  referenceCode: string;
  createdAt: string;
  updatedAt: string;
}

// Create Gl07 Batch Request
export interface CreateGl07BatchRequest {
  approvedApplicationIds: string[];
  createdBy?: string;
}

// Create Gl07 Batch Response
export interface CreateGl07BatchResponse {
  gl07BatchId: string;
  batchNumber: string;
  lineCount: number;
  message: string;
}

// Gl07 Batch File Response
export interface Gl07BatchFileResponse {
  gl07BatchId: string;
  batchNumber: string;
  status: Gl07BatchStatus;
  message: string;
}

// Paged Result
export interface PagedResult<T> {
  items: T[];
  count: number;
  pageNumber: number;
  pageSize: number;
}

// Gl07 Batch Filter Parameters
export interface Gl07BatchFilterParams {
  pageNumber?: number;
  pageSize?: number;
  status?: Gl07BatchStatus;
}

// Approved Applications Filter Parameters
export interface ApprovedApplicationsFilterParams {
  pageNumber?: number;
  pageSize?: number;
}
