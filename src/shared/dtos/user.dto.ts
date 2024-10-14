export type UserDataDto = {
  accountNumber: number;
  email: string;
  phone: string;
  agreement: boolean;
};

export type UserConfirmDataModel = {
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  dobIsVerified: boolean;
  password: string;
  confirmPassword: string;
  isTermsAccepted: boolean;
};

export type MFAMethod = "Email" | "SMS" | "None";

export type UserAuthStatusDto = {
  status: boolean;
  errorString: string | null;
  isPhoneConfirmed: boolean;
  isEmailConfirmed: boolean;
  defaultMFA: MFAMethod; // Assuming these are the possible values
  twoFactorEnabled: boolean;
}