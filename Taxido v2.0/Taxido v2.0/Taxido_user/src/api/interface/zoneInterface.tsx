export interface ZoneInterface {
    zoneValue?: ZoneDataInterface | [];
    token?: string;
    loading?: boolean;
    success?: boolean;
    fcmToken?: string;
}

export interface ZoneDataInterface {
    id?: number,
    name?: string
}
