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

export type PaymentResultResponseDto = {
  Timestamp: string;
  OrderId: string;
  ResultCode: string;
  Message: string;
  PasRef: string;
  AuthCode: string;
  Sha1Hash: string;
  BodyContent: { [key: string]: string };
};
