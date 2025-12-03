import { VEHICLE_TYPE, ALL_VEHICLE, RENTAL_VEHICLE_TYPE } from '../types/index'
import { vehicleTypeServices } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const vehicleTypeDataGet = createAsyncThunk(
  VEHICLE_TYPE,
  async ({
    service_id,
    service_category_id,
  }: {
    service_id: any
    service_category_id: any
  }) => {
    const response = await vehicleTypeServices.vehicleTypes(
      service_id,
      service_category_id,
    )
    return response?.data
  },
)


export const rentalVehicleTypesData = createAsyncThunk(
  RENTAL_VEHICLE_TYPE,
  async () => {
    const response = await vehicleTypeServices.rentalVehicleTypes()
    return response?.data
  },
)

export const vehicleData = createAsyncThunk(ALL_VEHICLE, async () => {
  const response = await vehicleTypeServices.allVehicleData()
  return response?.data
})
