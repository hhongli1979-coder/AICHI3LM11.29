import { rideRequest, accept_ride_request, reject_ride_request } from '../endpoints/rideRequestEndPoint'
import { GET_API, POST_API, PUT_API } from '../methods'
import { DriverRideRequest } from '../interface/rideRequestInterface'

export const rideRequestValue = async (zone_id: number) => {
  return GET_API(`${rideRequest}?zones=${zone_id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const driverRequestValue = async (data: DriverRideRequest) => {
  return POST_API(data, rideRequest)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const acceptRequestValue = async (data: DriverRideRequest) => {
  return POST_API(data, accept_ride_request)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const rejectRequestValue = async (data: DriverRideRequest) => {
  return POST_API(data, reject_ride_request)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const cancelRideRequestValue = async (ride_riquest_id: number) => {
  return PUT_API(`${rideRequest}/${ride_riquest_id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const rideRequestService = {
  rideRequestValue,
  driverRequestValue,
  acceptRequestValue,
  cancelRideRequestValue,
  rejectRequestValue,
}

export default rideRequestService
