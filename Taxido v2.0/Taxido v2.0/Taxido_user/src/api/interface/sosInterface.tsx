export interface SOSInterface {
    success?: boolean;
    cancelationValue?: SOSDataInterface;
    sosAlertvalue?: SOSAlertDataInterface | [];
    loading?: boolean;
    sosValue?: any;
    token?: null | string | undefined;
    fcmToken?: string | null | undefined
}


export interface SOSDataInterface {

}

export interface SOSAlertDataInterface {
    ride_id: number,
    location_coordinates: locationInterface
}


export interface locationInterface {
    lat: string,
    lng: string
}