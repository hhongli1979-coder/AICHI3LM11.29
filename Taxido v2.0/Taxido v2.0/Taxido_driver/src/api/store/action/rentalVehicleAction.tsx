import {
  RENTAL_VEHICLE,
  RENTAL_VEHICLE_LIST,
  RENTAL_VEHICLE_UPDATE,
  DELETE_RENTAL_VEHICLE,
  RENTAL_VEHICLE_DETAIL
} from '../types/index'
import { RentalInterface } from '../../interface/rentalVehicleInterface'
import { rentalvehicleService } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const rentalVehicleAdd = createAsyncThunk(
  RENTAL_VEHICLE,
  async (data: RentalInterface) => {
    const response = await rentalvehicleService.rentalVehicleAdd(data)
    return response?.data
  },
)

export const rentalVehicleData = createAsyncThunk(
  RENTAL_VEHICLE_LIST,
  async () => {
    const response = await rentalvehicleService.rentalVehicleData()
    return response?.data
  },
)

export const rentalVehicleDetail = createAsyncThunk(
  RENTAL_VEHICLE_DETAIL,
  async ({ id }: { id: number }) => {
    const response = await rentalvehicleService.rentalVehicleDetail(id)
    return response?.data
  },
)

export const rentalVehicleUpdate = createAsyncThunk(
  RENTAL_VEHICLE_UPDATE,
  async ({ rentalVehicleId, status }: { rentalVehicleId: number, status: number }) => {
    const response = await rentalvehicleService.rentalVehicleUpdate(rentalVehicleId, status)
    return response?.data
  },
)

export const deleteRentalVehicle = createAsyncThunk(DELETE_RENTAL_VEHICLE, async (id) => {
  const response = await rentalvehicleService.deleteRentalVehicle(id)
  if (response.status == 200) {
    return response?.data
  } else {
    return 'Error'
  }
})

