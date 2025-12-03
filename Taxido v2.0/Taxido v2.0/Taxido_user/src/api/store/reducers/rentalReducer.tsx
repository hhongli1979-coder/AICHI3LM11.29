import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rentalvehicleRequest, rentalVehicleList, rentalRideRequests, rentalVehicleListDetsils } from "../actions/rentalAction";
import { RentalInterface } from "../../interface/rentalinterface";

const initialState: RentalInterface = {
  rentalVehicleData: [],
  rentalVehicleLists: [],
  rentalRideRequestData: [],
  rentalVehicleListsDetails: [],
  loading: false,
  success: false,
  statusCode: null,
};

const rentalVehicleSlice = createSlice({
  name: "rentalVehicle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(rentalvehicleRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rentalvehicleRequest.fulfilled, (state, action) => {
      state.rentalVehicleData = action.payload;

      state.loading = false;
    });
    builder.addCase(rentalvehicleRequest.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });

    //rental Ride Request
    builder.addCase(rentalRideRequests.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      rentalRideRequests.fulfilled,
      (state, action: PayloadAction<{ data: any[]; status: number }>) => {
        state.loading = false;
        state.rentalRideRequestData = action.payload.data;
        state.statusCode = action.payload.status;
        state.success = true;
      }
    );
    builder.addCase(rentalRideRequests.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });

    //rental filter list
    builder.addCase(rentalVehicleList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rentalVehicleList.fulfilled, (state, action) => {
      state.rentalVehicleLists = action.payload;
      state.statusCode = action.payload.status;
      state.loading = false;
    });
    builder.addCase(rentalVehicleList.rejected, (state, action: any) => {
      state.loading = false;
      state.success = false;
      state.statusCode = action.payload?.status || 500;
    });



    //rental details data
    builder.addCase(rentalVehicleListDetsils.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rentalVehicleListDetsils.fulfilled, (state, action) => {
      state.rentalVehicleListsDetails = action.payload;
      state.statusCode = action.payload.status;
      state.loading = false;
    });
    builder.addCase(rentalVehicleListDetsils.rejected, (state, action: any) => {
      state.loading = false;
      state.success = false;
      state.statusCode = action.payload?.status || 500;
    });
  },
});

export default rentalVehicleSlice.reducer;
