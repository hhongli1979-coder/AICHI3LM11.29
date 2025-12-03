import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  vehicleTypeDataGet,
  vehicleData,
  rentalVehicleTypesData,
} from '../action/vehicleTypeAction'
import { VehicleTypeInterface } from '../../interface/vehicleTypeInterface'

const initialState: VehicleTypeInterface = {
  vehicleTypedata: [],
  rentalVehicleTypedata: [],
  allVehicle: [],
  token: '',
  loading: false,
  success: false,
  fcmToken: '',
}

const vehicleTypeSlice = createSlice({
  name: 'vehicleType',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(vehicleTypeDataGet.pending, state => {
      state.loading = true
    })
    builder.addCase(
      vehicleTypeDataGet.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.vehicleTypedata = action.payload
        state.loading = false
      },
    )
    builder.addCase(vehicleTypeDataGet.rejected, state => {
      state.loading = false
      state.success = false
    })

    builder.addCase(rentalVehicleTypesData.pending, state => {
      state.loading = true
    })
    builder.addCase(
      rentalVehicleTypesData.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.rentalVehicleTypedata = action.payload
        state.loading = false
      },
    )
    builder.addCase(rentalVehicleTypesData.rejected, state => {
      state.loading = false
      state.success = false
    })

    builder.addCase(vehicleData.pending, state => {
      state.loading = true
    })
    builder.addCase(vehicleData.fulfilled, (state, action) => {
      state.allVehicle = action.payload
      state.loading = false
    })
    builder.addCase(vehicleData.rejected, state => {
      state.loading = false
      state.success = false
    })
  },
})

export default vehicleTypeSlice.reducer
