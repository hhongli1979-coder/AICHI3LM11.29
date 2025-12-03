export interface RideRequestInterface {
    success?: boolean;
    rideRequestData?: RideRequestDataInterface;
    updateRideRequestData?: UpdateRequestDataInterface;
    rideLocationData?: RideLocationDataInterface;
    loading?: boolean
}

export interface RideRequestDataInterface {
    location_points: locationPointInterface;
    new_rider: newRiderInterface;
    locations: string
    ride_fare: number,
    service_id: number,
    service_category_id: number,
    vehicle_type_id: number,
    distance: number,
    distance_unit: string,
    payment_method: string,
    wallet_balance: string,
    coupon: string,
}

export interface locationPointInterface {
    lat: number,
    lag: number
}

export interface newRiderInterface {
    name: string,
    email: string,
    country_code: string,
    phone: number
}

export interface UpdateRequestDataInterface {
    id: number,
    rider_id: number,
    service_id: number,
    vehicle_type_id: number,
    service_category_id: number,
    rider: RiderDataInterface,
    locations: string,
    location_coordinates: locationPointInterface,
    duration: null,
    distance: number,
    distance_unit: string,
    payment_method: string,
    ride_fare: number,
    created_by_id: number,
    created_at: string
}

export interface RiderDataInterface {
    id: number,
    name: string,
    role: RoleDataInterface,
    email: string,
    phone: number,
    country_code: string,
    profile_image: string
}

export interface RoleDataInterface {
    id: number,
    name: string,
    guard_name: string,
    system_reserve: number
}

export interface BillDetailsInterface {
    ride_fare: number;
    tax: number;
    platform_fees: number;
    total: number;
}

export interface serviceInterface {
    slug: string;

}

export interface rideDetailsInterface {
    service: serviceInterface
    otp: number;
    name: string;
}


export interface RideLocationDataInterface {

}