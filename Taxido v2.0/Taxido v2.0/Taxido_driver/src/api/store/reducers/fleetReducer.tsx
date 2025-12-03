import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fleetVehicleAdd, fleetVehicleList, fleetDriverList } from '../action/fleetAction'
import { FleetVehicleInterface } from '../../interface/fleetInterface'

const initialState: FleetVehicleInterface = {
    loading: false,
    success: false,
    fleetVehicle: [],
    fleetDriver: [],
}

const fleetSlice = createSlice({
    name: 'fleet',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fleetVehicleAdd.pending, state => {
            state.loading = true
        })
        builder.addCase(
            fleetVehicleAdd.fulfilled,
            (state, action: PayloadAction<any[]>) => {
                state.loading = false
                state.success = true
            },
        )
        builder.addCase(fleetVehicleAdd.rejected, state => {
            state.loading = false
            state.success = false
        })

        //fleet vehicle list
        builder.addCase(fleetVehicleList.pending, state => {
            state.loading = true
        })
        builder.addCase(fleetVehicleList.fulfilled, (state, action) => {
            state.fleetVehicle = action.payload
            state.loading = false
        })
        builder.addCase(fleetVehicleList.rejected, state => {
            state.loading = false
            state.success = false
        })

        //fleet driver list
        builder.addCase(fleetDriverList.pending, state => {
            state.loading = true
        })
        builder.addCase(fleetDriverList.fulfilled, (state, action) => {
            state.fleetDriver = action.payload
            state.loading = false
        })
        builder.addCase(fleetDriverList.rejected, state => {
            state.loading = false
            state.success = false
        })
    },
})

export default fleetSlice.reducer
