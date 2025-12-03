export interface DriverInterface {
    driverData?: any;
    token?: string;
    loading?: boolean;
    success?: boolean;
    fcmToken?: string;
    zones?: any;
    is_online?: any;
    is_on_ride?: any

}

export interface DriverDataInterface {
    id: number,
    name: string,
    username: string,
    email: string,
    email_verified_at: string,
    country_code: string,
    phone: number,
    profile_image_id: null,
    is_verified: number,
    status: boolean,
    referral_code: string,
    referred_by_id: null,
    created_by_id: number,
    system_reserve: string,
    created_at: string,
    is_online: number,
    is_on_ride: null,
    location: LocationDataInterface,
    service_id: string,
    service_category_id: string,
    role: RoleDataInterface,
    address: AddressDataInterface,
    vehicle_info: VehicleDataInterface,
    payment_account: AccountDataInterface,
    zones: ZoneDataInterface[],
}



export interface LocationDataInterface {
    lat: number,
    lng: number
}

export interface RoleDataInterface {
    id: number,
    name: string,
    guard_name: string,
    system_reserve: number
}

export interface AddressDataInterface {
    id: number,
    user_id: string,
    is_primary: string,
    title: string,
    address: string,
    street_address: string,
    area_locality: string,
    postal_code: string,
    country_id: number,
    state_id: number,
    city: string,
    latitude: number,
    longitude: number,
    status: number,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    country: CountryDataInterface,
    state: StateDataInterface,
}

export interface CountryDataInterface {
    id: number,
    name: string
}

export interface StateDataInterface {
    id: number,
    name: string
}

export interface VehicleDataInterface {
    id: number,
    plate_number: string,
    color: string,
    model: string,
    seat: string,
    vehicle_type_id: number,
    vehicle_image: string,
    driver_id: number,
    created_at: string,
    updated_at: string,
    deleted_at: string
}

export interface AccountDataInterface {
    id: number,
    user_id: number,
    paypal_email: string,
    bank_name: string,
    bank_holder_name: string,
    bank_account_no: string,
    swift: string,
    ifsc: string,
    status: number,
    created_at: string,
    updated_at: string,
    deleted_at: string
}

export interface ZoneDataInterface {
    id: number,
    name: string,
    place_points: PlacePointDataInterface,
    location: LocationDataInterface,
    status: string,
    distance_type: string,
    currency_id: string,
    created_by_id: string,
    created_at: string,
    updated_at: string,
    deleted_at: null,
    pivot: PivotDataInterface,
}

export interface PlacePointDataInterface {
    type: string,
    coordinates: string,
}

export interface PivotDataInterface {
    driver_id: number,
    zone_id: number
}




