import { fleetVehicle, fleetVehiclelist, fleetDriverlist } from '../endpoints/fleetEndpoint'
import { FleetVehicleInterface } from '../interface/fleetInterface'
import { GET_API, POST_API } from '../methods'

export const fleetVehicleAdd = async (data: FleetVehicleInterface) => {
  return POST_API(data, fleetVehicle)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const fleetVehicleList = async () => {
  return GET_API(fleetVehiclelist)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const fleetDriverList = async () => {
  return GET_API(fleetDriverlist)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const fleetServices = {
  fleetVehicleAdd,
  fleetVehicleList,
  fleetDriverList
}

export default fleetServices
