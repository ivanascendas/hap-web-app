import { MFAMethod } from "../dtos/user.dto";

export type UserModel = {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  accountNumber?: number;
  phone?: string;
  emailConfirmed?: boolean;
  phoneNumberConfirmed?: boolean;
  dobIsVerified?: boolean;
  defaultMFA?: MFAMethod;
};
