export interface CountryCodeType {
    callingCode: string[];
    cca2: string;
};

export interface UserRegistrationInterface {
    username?: string,
    name?: string,
    email?: string,
    country_code?: string,
    phone?: string,
    fcm_token?: string | null,
    password?: string | number,
    password_confirmation: string | number,
}