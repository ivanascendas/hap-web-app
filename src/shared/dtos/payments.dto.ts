export type PaymentResponseDto = {
  timestamp: Date;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  zipcode: string;
  customerNumber: any[];
  merchantId: string;
  account: string;
  orderId: string;
  amount: number;
  currency: string;
  autoSettleFlag: string;
  hppLang: string;
  sha1Hash: string;
};

export type PaymentDto = {
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

/**
 * Raw payment response from Realex HPP (Base64 encoded values)
 */
export interface RawPaymentResponseDto {
  CAVV?: string;
  SRD?: string;
  CVNRESULT?: string;
  HPP_CUSTOMER_PHONENUMBER_MOBILE?: string;
  PASREF: string;
  MESSAGE: string;
  DS_TRANS_ID?: string;
  ACCOUNT: string;
  AVSPOSTCODERESULT?: string;
  AMOUNT: string;
  TIMESTAMP: string;
  pas_uuid?: string;
  HPP_BILLING_STREET3?: string;
  HPP_BILLING_STREET2?: string;
  AUTHCODE: string;
  HPP_BILLING_STREET1?: string;
  HPP_BILLING_CITY?: string;
  AVSADDRESSRESULT?: string;
  AUTHENTICATION_VALUE?: string;
  HPP_BILLING_POSTALCODE?: string;
  ECI?: string;
  HPP_BILLING_COUNTRY?: string;
  HPP_LANG?: string;
  MESSAGE_VERSION?: string;
  BATCHID?: string;
  XID?: string;
  SHA1HASH: string;
  ORDER_ID: string;
  CARD_PAYMENT_BUTTON?: string;
  HPP_CUSTOMER_EMAIL?: string;
  RESULT: string;
  MERCHANT_ID: string;
}

/**
 * Decoded payment response with human-readable values
 */
export interface DecodedPaymentResponseDto {
  /** Cardholder Authentication Verification Value */
  CAVV?: string;
  /** Secure Remote Data */
  SRD?: string;
  /** CVN Result Code */
  CVNRESULT?: string;
  /** Customer mobile phone number */
  HPP_CUSTOMER_PHONENUMBER_MOBILE?: string;
  /** Payment gateway reference */
  PASREF: string;
  /** Payment status message */
  MESSAGE: string;
  /** 3DS Transaction ID */
  DS_TRANS_ID?: string;
  /** Merchant account */
  ACCOUNT: string;
  /** AVS Postcode Result */
  AVSPOSTCODERESULT?: string;
  /** Payment amount in cents */
  AMOUNT: string;
  /** Transaction timestamp (YYYYMMDDHHmmss) */
  TIMESTAMP: string;
  /** Payment UUID */
  pas_uuid?: string;
  /** Billing address line 3 */
  HPP_BILLING_STREET3?: string;
  /** Billing address line 2 */
  HPP_BILLING_STREET2?: string;
  /** Authorization code */
  AUTHCODE: string;
  /** Billing address line 1 */
  HPP_BILLING_STREET1?: string;
  /** Billing city */
  HPP_BILLING_CITY?: string;
  /** AVS Address Result */
  AVSADDRESSRESULT?: string;
  /** 3DS Authentication Value */
  AUTHENTICATION_VALUE?: string;
  /** Billing postal code */
  HPP_BILLING_POSTALCODE?: string;
  /** Electronic Commerce Indicator */
  ECI?: string;
  /** Billing country code */
  HPP_BILLING_COUNTRY?: string;
  /** HPP language */
  HPP_LANG?: string;
  /** Message version */
  MESSAGE_VERSION?: string;
  /** Batch ID */
  BATCHID?: string;
  /** 3DS XID */
  XID?: string;
  /** SHA1 hash for verification */
  SHA1HASH: string;
  /** Order/Transaction ID */
  ORDER_ID: string;
  /** Payment button text */
  CARD_PAYMENT_BUTTON?: string;
  /** Customer email */
  HPP_CUSTOMER_EMAIL?: string;
  /** Result code (00 = success) */
  RESULT: string;
  /** Merchant ID */
  MERCHANT_ID: string;
}

/**
 * Payment result codes
 */
export enum PaymentResultCode {
  SUCCESS = "00",
  DECLINED = "101",
  REFERRAL = "102",
  CARD_ERROR = "103",
  SYSTEM_ERROR = "200",
  TIMEOUT = "508",
}

export type PaymentResultResponseDto = {
  Timestamp: string;
  OrderId: string;
  ResultCode: string;
  Message: string;
  PasRef: string;
  AuthCode: string;
  Sha1Hash: string;
  BodyContent: DecodedPaymentResponseDto;
};
