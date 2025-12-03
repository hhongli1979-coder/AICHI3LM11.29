export interface RentalInterface {
    success?: boolean;
    rentalVehicleData?: RentalvehicleDataInterface;
    rentalVehicleLists?: RentalvehicleDataInterface;
    rentalRideRequestData?: RentalvehicleDataInterface;
    rentalVehicleListsDetails?: RentalvehicleDataInterface;
    loading?: boolean;
    statusCode?: number | null | undefined
}

export interface RentalvehicleDataInterface {

}



export interface RentalBookinginterface {
    location_coordinates: locationInterface[]
    locations: string[],
    service_id: string,
    service_category_id: string,
    vehicle_type_id: string,
    rental_vehicle_id: string,
    is_with_driver: string,
    payment_method: string,
    start_time: string,
    end_time: string,
    currency_code: string
}


export interface locationInterface {
    lat: string,
    lng: string,
}