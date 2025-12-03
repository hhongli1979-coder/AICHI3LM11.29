import { ride, startRide, ambulanceRide } from '../endpoints/rideEndPoint'
import { GET_API, POST_API, PUT_API } from '../methods'
import { RidePostInterface } from '../interface/rideInterface'

export const rideDataGet = async (ride_id: number) => {
  return GET_API(`${ride}/${ride_id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const rideDataGets = async () => {
  return GET_API(`${ride}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const ambulanceRideData = async (data: RidePostInterface) => {
  return POST_API(data, `${ambulanceRide}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const rideUpdate = async ({
  data,
  ride_id,
}: {
  data: any
  ride_id: number
}) => {
  return PUT_API(data, `${ride}/${ride_id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const userstartRide = async (data: RidePostInterface) => {
  return POST_API(data, `${ride}/${startRide}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const rideServices = {
  rideDataGet,
  rideDataGets,
  userstartRide,
  rideUpdate,
  ambulanceRideData,
}

export default rideServices
