export interface RideRequestPayload {
  success?: boolean
  rideRequestdata: RideRequestDataPayload
  loading?: boolean
}

export interface RideRequestDataPayload {
  id: number
  rider_id: number
  service_id: number
  vehicle_type_id: number
  service_category_id: number
  rider: RideDataInterface
  locations: string
  location_coordinates: locationDataInterface
  duration: string
  distance: string
  distance_unit: string
  payment_method: string
  ride_fare: number
  created_by_id: number
  created_at: string
}

export interface RideDataInterface {
  id: number
  name: string
  role: RoleDataInterface
}

export interface RoleDataInterface {
  id: number
  name: string
  guard_name: string
  system_reserve: number
}

export interface locationDataInterface {
  lat: number
  lng: number
}

export interface DriverRideRequest {
  location_coordinates: locationDataInterface
  locations: string
  ride_fare: number
  service_id: number
  service_category_id: number
  vehicle_type_id: number
  distance: number
  distance_unit: string
  payment_method: string
  wallet_balance: number
  coupon: string
}
