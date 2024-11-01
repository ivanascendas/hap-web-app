import { MFAMethod } from "../dtos/user.dto";

export type UserModel = {
  phoneExcludingCountryCode: string;
  phoneCountryCode: string;
  password: string;
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
  tempPassword?: string;
  userId?: string;
  customerName?: string;
  address?: string;
  town?: string;
  county?: string;
  customerNo?: string;
  drNumber?: string;
  countryCode?: string;
  phoneExcCountryCode?: string;
  zipcode?: string | null;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  isMfaEnabled?: boolean;
  isEmailConfirmed?: boolean;
  incDepts?: string | null
};
