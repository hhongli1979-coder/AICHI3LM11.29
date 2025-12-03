export interface DriverInterface {
    rideData?: RideDataInterface | any;
    paymentData?: PaymentInterface | any;
    rideDatas?: RideDataInterface | any;
    rideUpdate?: UpdateRideInterface | any;
    locationUpdate?: any;
    invoiceData?: number | [];
    token?: string;
    loading?: boolean;
    success?: boolean;
    fcmToken?: string;
    statusCode?: string | null | undefined

}


export interface RideDataInterface {
    id?: number,
    ride_number?: number
}

export interface PaymentInterface {
    ride_id: number,
    driver_tip: number,
    commnet: string,
    coupon: string,
    payment_method: string
}

export interface UpdateRideInterface {
    status: string,
    cancellation_reason: string
}
