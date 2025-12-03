export interface ReviewInterface {
  success?: boolean
  userReviewData?: ReviewDataInterface
  rentalVehicleDetailData?: ReviewDataInterface
  rentalVehicleList?: RentalVehicleListInterface
  rentalUpdate?: RentalVehicleListInterface
  loading?: boolean,
  ride_id?: any,
  rating?: null | string | number,
  description?: string
}

export interface ReviewDataInterface {
  ride_id: number

  rating: number
  description: string
}

export interface RentalVehicleListInterface { }
