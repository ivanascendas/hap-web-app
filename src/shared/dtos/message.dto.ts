export type ErrorMessagesDto = {
  regCustomerNumberNotExists: string;
  regCustomerAlreadyRegistered: string;
  regWrongCustomerNumberOrPassword: string;
  regTempPasswordExpired: string;
  resCustomerNumberNotExists: string;
  resCustomerAlreadyRegistered: string;
  capMissingInputSecret: string;
  capInvalidInputSecret: string;
  capMissingInputResponse: string;
  capInvalidInputResponse: string;
  capOtherCapthaError: string;
  paymentErr1xx: string;
  paymentErr2xx: string;
  paymentErr3xx: string;
  paymentErr5xx: string;
  paymentErr666: string;
  paymentSuccess: string;
};
