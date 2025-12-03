export interface CouponsInterface {
    couponsList?: CouponsListInterface | [];
    couponsverify?: CouponsVerifyInterface | [];
    success?: boolean;
    loading?: boolean;
    statusCode?: number | null | undefined
}


export interface CouponsListInterface {
    id: number,
    title: string,
    description: string,
    code: string,
    type: string,
    amount: string,
    is_apply_all: string,
    min_spend: number,
    is_unlimited: number,
    usage_per_coupon: string,
    usage_per_rider: number,
    used: string,
    status: number,
    is_expired: number,
    is_first_ride: number,
    start_date: string,
    end_date: string,
    created_by_id: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    zones: ZoneInterface
}

export interface ZoneInterface {
    id: number,
    name: string,
    pivot: PivotInterface
}

export interface PivotInterface {
    coupon_id: string,
    zone_id: string
}


export interface CouponsVerifyInterface {

}

