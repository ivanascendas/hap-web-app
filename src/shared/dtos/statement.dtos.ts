import { PaggingBaseDto, PaggingResponse } from "./pagging-base.request";

export interface StatementDto {
    voucherNo: number;
    sequenceNo: number;
    statementDate: string;
    invoiceNo: string;
    propertyNumber: string;
    propertyDescription: string;
    amount: number;
    payStatus: string;
    transType: string;
    balance: number;
}

export interface StatementResponse extends PaggingResponse<StatementDto> {
}


export interface StatementQueryParams extends PaggingBaseDto {
    from: string;
    to: string;
    IncDept: string;
}

export type LoanInfoDto = {
    loanNumber: number;
    capitalBalance: number;
    interestRate: string;
    loanEndDate: string;
}