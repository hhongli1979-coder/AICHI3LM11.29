export interface RentalInterface {
  success?: boolean;
  DriverReview?: DriverReviewDataInterface;
  loading?: boolean;
}

export interface DriverReviewDataInterface {
  DriverReview?: any;
  ride_id?: number;
  driver_id?: number;
  rating?: number;
  message?: string;
  token?: string | null | undefined
  loading?: boolean;
  success?: boolean;
  fcmToken?: string | null | undefined
}
