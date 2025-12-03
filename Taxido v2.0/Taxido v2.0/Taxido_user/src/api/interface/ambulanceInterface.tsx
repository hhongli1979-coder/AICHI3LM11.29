export interface AmbulanceInterface {
    loading?: boolean;
    fcmToken?: string;
    ambulanceList?: ambulanceRequestInterface;
    ambulanceRequest?: ambulanceRequestInterface;
    token?: string;
    success?: boolean;
    statusCode?: number | null | undefined;
}


export interface ambulanceRequestInterface {

}