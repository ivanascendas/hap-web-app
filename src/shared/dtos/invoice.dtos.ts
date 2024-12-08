import { PaggingBaseDto, PaggingResponse } from "./pagging-base.request";

export interface CustomerTransactionBase {
  voucherNo: number | null;
  sequenceNo: number | null;
  invoiceNo: string;
  propertyDescription: string;
}

export interface RelatedPayment extends CustomerTransactionBase {
  incDept: string;
  amount: number;
  date: Date;
}

export interface InvoiceDto extends CustomerTransactionBase {
  issuedOn: Date | null;
  pending: number | null;
  totalPaid: number | null;
  total: number | null;
  dueDate: Date | null;
  statementDate?: Date;
  propertyNumber?: string;
}

export interface InvoiceWithRelatedPayments extends InvoiceDto {
  relatedPayments: RelatedPayment[];
}

export interface InvoiceInputRequest {
  voucherNo: number;
  sequenceNo: number;
  incDept?: string;
}

export interface InvoiceDownloadRequest {
  VoucherNo: number;
  SequenceNo: number;
}

export interface InvoiceQueryParams extends PaggingBaseDto {
  incDept: string;
}

export interface InvoicesResponse extends PaggingResponse<InvoiceDto> {}
