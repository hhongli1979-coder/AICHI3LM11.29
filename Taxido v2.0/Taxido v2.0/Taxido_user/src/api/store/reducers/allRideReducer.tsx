import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { allRide, allpayment, allRides, rideDataPut, allInvoice, locationChanges } from '../actions/allRideAction';
import { DriverInterface } from '../../interface/allRideInterface';

const initialState: DriverInterface = {
  rideData: [],
  paymentData: [],
  rideDatas: [],
  rideUpdate: [],
  invoiceData: [],
  locationUpdate: [],
  token: '',
  loading: false,
  success: false,
  fcmToken: '',
  statusCode: null,
};

const rideSlice = createSlice({
  name: 'allRide',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(allRide.pending, (state) => {
        state.loading = false;
      })

    builder.addCase(
      allRide.fulfilled,
      (state: any, action: PayloadAction<{ data: any[]; status: number }>) => {
        state.loading = false;
        state.rideData = action.payload.data;
        state.statusCode = action.payload.status;
        state.success = true;
      })
      .addCase(allRide.rejected, (state) => {
        state.loading = false;
        state.success = false;
        state.statusCode = action.payload?.status || 500;
      })


      .addCase(allInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(allInvoice.fulfilled, (state, action) => {
        state.invoiceData = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(allInvoice.rejected, (state) => {
        state.loading = false;
        state.success = false;
      })

      .addCase(locationChanges.pending, (state) => {
        state.loading = true;
      })
      .addCase(locationChanges.fulfilled, (state, action) => {
        state.locationUpdate = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(locationChanges.rejected, (state) => {
        state.loading = false;
        state.success = false;
      })



      .addCase(allRides.pending, (state) => {
        state.loading = false;
      })
      .addCase(allRides.fulfilled, (state, action) => {
        state.rideDatas = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(allRides.rejected, (state) => {
        state.loading = false;
        state.success = false;
      })



      .addCase(allpayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(allpayment.fulfilled, (state, action) => {
        state.paymentData = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(allpayment.rejected, (state) => {
        state.loading = false;
        state.success = false;
      });



    builder.addCase(rideDataPut.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rideDataPut.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.rideUpdate = action.payload;
      state.loading = false;
    });
    builder.addCase(rideDataPut.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });

  },
});

export default rideSlice.reducer;
