export interface RideRequestData {
    pickupLocation?: string | number | {};
    stops?: string[] | any;
    destination?: string;
    service_ID: string | number;
    zoneValue?: string | number;
    service_category_ID: string | number;
    receiverName?: string;
    countryCode: string;
    phoneNumber: string;
    scheduleDate?: string | Date;
    filteredLocations?: string[];
    descriptionText?: string;
    otherContact?: string;
    otherName?: string;
    pickupCoords?: {
        latitude: number;
        longitude: number;
    };
    destinationCoords?: {
        latitude: number;
        longitude: number;
    };
    selectedImage?: string | { uri: string };
    parcelWeight?: string | number;
}
