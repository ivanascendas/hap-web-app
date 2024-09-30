export type SmsOTPRequestDto = {
  UserId: string;
  PhoneNumber: string;
};

export type EmailOTPRequestDto = {
  UserId: string;
  EmailId: string;
};
