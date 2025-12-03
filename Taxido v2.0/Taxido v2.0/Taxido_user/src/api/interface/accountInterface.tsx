export interface AccountInterface {
    id: number,
    name: string,
    username: string,
    email: string,
    email_verified_at: string,
    country_code: string,
    phone: number,
    profile_image_id: string,
    status: number,
    referral_code: string,
    referred_by_id: string,
    created_by_id: string,
    system_reserve: string,
    deleted_at: string,
    created_at: string,
    updated_at: string,
    role: string,
    permission: [],
    roles: [],
    permissions: []
}

export interface UpdateProfileInterface {
    data?: any
}

export interface CountryInterface {
    data?: any
}