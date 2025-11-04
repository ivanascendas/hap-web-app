import { PaymentResultCode } from "@shared/dtos/payments.dto";

export type PaymentModel = {
  VoucherNo: string;
  SequenceNo: string;
  AmountToPay: number;
  incDept: string;
  Name: string;
  Number: string;
  Address1: string;
  Address2: string;
  Address3: string;
  County: string;
  phoneCode: string;
  City: string;
  Country: string;
  Email: string;
  Phone: string;
  Zipcode: string;
};
// ...existing code...

/**
 * Helper to check if payment was successful
 */
export const isPaymentSuccessful = (result: string): boolean => {
  return result === PaymentResultCode.SUCCESS;
};
