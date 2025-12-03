export interface BidInterface {
  success?: boolean
  bidValue?: BidDataInterface
  loading?: boolean
}

export interface BidDataInterface {
  id: number
  ride_request_id: number
  driver_id: number
  amount: number
  status: string
  created_at: string
  updated_at: string
  deleted_at: string
}
