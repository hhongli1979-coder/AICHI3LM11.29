import {
  rentalVehicle,
  rentalVehicleList
} from '../endpoints/rentalVehicleEndpoint'
import { DELETE_API, GET_API, POST_API, PUT_API } from '../methods'
import { RentalInterface } from '../interface/rentalVehicleInterface'

export const rentalVehicleAdd = async (data: RentalInterface) => {
  return POST_API(data, rentalVehicle)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const rentalVehicleData = async () => {
  return GET_API(rentalVehicle)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const rentalVehicleDetail = async (id: number) => {
  return GET_API(`${rentalVehicle}/${id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const rentalVehicleUpdate = async (rentalVehicleId: number, status: number) => {
  const url = `${rentalVehicleList}/${rentalVehicleId}/${status}`;
  return PUT_API(undefined, url)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const deleteRentalVehicle = async (id) => {
  return DELETE_API(`${rentalVehicle}/${id}`)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const rentalvehicleService = {
  rentalVehicleAdd,
  rentalVehicleData,
  rentalVehicleDetail,
  rentalVehicleUpdate,
  deleteRentalVehicle
}

export default rentalvehicleService
