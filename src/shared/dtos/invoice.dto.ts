
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

export interface InvoiceWithRelatedPayments extends CustomerTransactionBase {
    issuedOn: Date | null;
    pending: number | null;
    totalPaid: number | null;
    total: number | null;
    dueDate: Date | null;
    relatedPayments: RelatedPayment[];
}

export interface InvoiceInputRequest {
    voucherNo: number;
    sequenceNo: number;
    incDept: string;
}