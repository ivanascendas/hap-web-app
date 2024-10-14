import { MFAMethod } from "./user.dto";

export type TokenDto = {
  access_token: string;
  token_type: string;
  expires_in: number;
  phoneNumber: string | undefined;
  email: string | undefined;
  ".issued": string;
  ".expires": string;
  "two_factor_auth": number;
  "defaultmfa": MFAMethod | undefined;

};
