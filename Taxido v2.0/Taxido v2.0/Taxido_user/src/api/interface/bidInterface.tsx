export interface BidInterface {
    success?: boolean;
    bidValue?: BidDataInterface | [];
    loading?: boolean;
    bidUpdateData?: [] | any;
    token?: string | null | undefined;
    fcmToken?: string | null | undefined;
}


export interface BidDataInterface {
    id: number,
    ride_request_id: number,
    driver_id: number,
    amount: number,
    status: string,
    created_at: string,
    updated_at: string,
    deleted_at: string
}

export interface BidUpdateInterface {
    status: string;
}