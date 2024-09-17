export type CheckTempPasswordRequestDto = {
  accountNumber: string;
  tempPassword: string;
};
export type CheckTempPasswordResponseDto = {
  code?: number;
};
