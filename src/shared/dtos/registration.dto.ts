export type RegistrationRequestDto = {
    accountNumber: string,
    tempPassword: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string,
    defaultMFA: string,
    emailConfirmed: string,
    phoneNumberConfirmed: string,
    PhoneCountryCode: string,
    PhoneExcludingCountryCode: string
}