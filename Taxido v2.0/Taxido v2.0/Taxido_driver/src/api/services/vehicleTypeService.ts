import { vehicleType } from '../endpoints/vehicleTypeEndPoint'
import { GET_API } from '../methods'

export const vehicleTypes = async (
  service_id: any,
  service_category_id: any,
) => {
  return GET_API(
    `${vehicleType}?service_id=${service_id}&service_category_id=${service_category_id}`,
  )
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}





export const rentalVehicleTypes = async () => {
  return GET_API(`${vehicleType}?service_category=rental`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const allVehicleData = async () => {
  return GET_API(vehicleType)
    .then(res => {
      return res.data
    })
    .catch(e => {
      return e?.response
    })
}

const vehicleTypeServices = {
  vehicleTypes,
  allVehicleData,
  rentalVehicleTypes,
}

export default vehicleTypeServices
