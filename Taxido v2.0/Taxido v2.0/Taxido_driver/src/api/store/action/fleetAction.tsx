import { FLEET_VEHICLE, FLEET_VEHICLE_LIST, FLEET_DRIVER_LIST } from '../types/index'
import { FleetVehicleInterface } from '../../interface/fleetInterface'
import { fleetServices } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fleetVehicleAdd = createAsyncThunk(
    FLEET_VEHICLE,
    async (data: FleetVehicleInterface) => {
        const response = await fleetServices.fleetVehicleAdd(data)
        return response?.data
    },
)

export const fleetVehicleList = createAsyncThunk(FLEET_VEHICLE_LIST, async () => {
    const response = await fleetServices.fleetVehicleList()
    return response?.data
})

export const fleetDriverList = createAsyncThunk(FLEET_DRIVER_LIST, async () => {
    const response = await fleetServices.fleetDriverList()
    return response?.data
})
