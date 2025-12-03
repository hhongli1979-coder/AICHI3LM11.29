import { RIDE_REQUEST, UPDATE_RIDE_REQUEST, RIDE_LOCATION } from "../types/index";
import { rideRequestServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RideRequestInterface } from '../../interface/rideRequestInterface';


export const userRideRequest = createAsyncThunk(
  RIDE_REQUEST,
  async (data: RideRequestInterface) => {
    const response = await rideRequestServices.userRideRequest(data);
    return response?.data;
  });


export const updateRideRequest = createAsyncThunk(
  UPDATE_RIDE_REQUEST,
  async ({ payload, ride_id }: { payload: any; ride_id: number | null | undefined | any }) => {
    const response = await rideRequestServices.updateRideRequest({ payload, ride_id });
    return response?.data;
  }
);


export const userRideLocation = createAsyncThunk(RIDE_LOCATION, async ({ ride_number }: { ride_number: number }) => {
  const response = await rideRequestServices.userRideLocation({ ride_number });
  return response?.data;
},
);
