import { createSlice } from '@reduxjs/toolkit'
import {
  rentalVehicleAdd,
  rentalVehicleData,
  rentalVehicleUpdate,
  deleteRentalVehicle,
  rentalVehicleDetail
} from '../action/rentalVehicleAction'
import { ReviewInterface } from '../../interface/reviewInterface'

const initialState: ReviewInterface = {
  rentalVehicleData: [],
  rentalVehicleDetailData: [],
  rentalVehicleList: [],
  rentalUpdate: [],
  loading: false,
  success: false,
}

const reviewSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(rentalVehicleAdd.pending, state => {
      state.loading = true
    })
    builder.addCase(rentalVehicleAdd.fulfilled, (state, action) => {
      state.rentalVehicleAdd = action.payload
      state.loading = false
    })
    builder.addCase(rentalVehicleAdd.rejected, state => {
      state.loading = false
      state.success = false
    })

    builder.addCase(rentalVehicleData.pending, state => {
      state.loading = true
    })
    builder.addCase(rentalVehicleData.fulfilled, (state, action) => {
      state.rentalVehicleList = action.payload
      state.loading = false
    })
    builder.addCase(rentalVehicleData.rejected, state => {
      state.loading = false
      state.success = false
    })

    //rental Detail

    builder.addCase(rentalVehicleDetail.pending, state => {
      state.loading = true
    })
    builder.addCase(rentalVehicleDetail.fulfilled, (state, action) => {
      state.rentalVehicleDetailData = action.payload
      state.loading = false
    })
    builder.addCase(rentalVehicleDetail.rejected, state => {
      state.loading = false
      state.success = false
    })




    builder.addCase(rentalVehicleUpdate.pending, state => {
      state.loading = true
    })
    builder.addCase(rentalVehicleUpdate.fulfilled, (state, action) => {
      state.rentalUpdate = action.payload
      state.loading = false
    })
    builder.addCase(rentalVehicleUpdate.rejected, state => {
      state.loading = false
      state.success = false
    })


    builder.addCase(deleteRentalVehicle.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(deleteRentalVehicle.fulfilled, (state, action) => { })
    builder.addCase(deleteRentalVehicle.rejected, (state, action) => {
      state.loading = false
    })

  },
})

export default reviewSlice.reducer
