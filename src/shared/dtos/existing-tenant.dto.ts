export type ExsistingTenantDto = {
    DefaultMFA: string;
    EmailConfirmed: boolean;
    PhoneNumberConfirmed: boolean;
    PhoneNumber: string;
    EmailId: string;
    PhoneCountryCode: string;
    PhoneExcludingCountryCode: string;
}

export type CheckValidContactDto = {
    status: boolean,
    errorString: null,
    isPhoneConfirmed: boolean,
    isEmailConfirmed: boolean,
    defaultMFA: string,
    twoFactorEnabled: boolean
}