import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { rideRequestDataGet, driverRequestDataGet, acceptRequestValue, cancelRideRequestValue, rejectRequestValue } from '../action/rideRequestAction'
import { RideRequestPayload } from '../../interface/rideRequestInterface'

const initialState: RideRequestPayload = {
  rideRequestdata: [],
  token: '',
  loading: false,
  success: false,
  fcmToken: '',
  statusCode: null,
}

const rideRequestTypeSlice = createSlice({
  name: 'rideRequest',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(rideRequestDataGet.pending, state => {
      state.loading = true
    })
    builder.addCase(
      rideRequestDataGet.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.rideRequestdata = action.payload
        state.statusCode = action.payload.status
        state.loading = false
      },
    )
    builder.addCase(rideRequestDataGet.rejected, state => {
      state.statusCode = action.payload?.status || 500
      state.loading = false
      state.success = false
    })

    //Driver Request
    builder.addCase(driverRequestDataGet.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(driverRequestDataGet.fulfilled, (state, action) => {
      state.loading = false
    })

    //Accept Ride Request
    builder.addCase(acceptRequestValue.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(acceptRequestValue.fulfilled, (state, action) => {
      state.loading = false
    })

    //rejct Ride Request
    builder.addCase(rejectRequestValue.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(rejectRequestValue.fulfilled, (state, action) => {
      state.loading = false
    })

    //Cancel Ride Request
    builder.addCase(cancelRideRequestValue.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(cancelRideRequestValue.fulfilled, (state, action) => {
      state.loading = false
    })
  },
})

export default rideRequestTypeSlice.reducer
