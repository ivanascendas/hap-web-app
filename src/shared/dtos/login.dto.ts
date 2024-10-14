export type LoginDto = {
  username: string;
  password: string;
  mfaMethod?: string;
};

export type LoginWithCodeDto = {
  code: string;
  token: string;
  mfaMethod?: string;
};
