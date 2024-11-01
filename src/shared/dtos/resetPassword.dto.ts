export type ResetPasswordDto = {
    password: string;
    confirmPassword: string;
    accountNumber: string;
    code: string;
};