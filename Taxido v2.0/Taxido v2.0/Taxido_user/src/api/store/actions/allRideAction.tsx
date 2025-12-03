import { ALLRIDE, PAYMENT_AMOUNT, ALLRIDES, RIDECOMPLETE, INVOICE, LOCATION_CHANGES } from "../types/index";
import { createAsyncThunk } from '@reduxjs/toolkit';
import allRideService from "@src/api/services/allRideService";
import { PaymentInterface, UpdateRideInterface } from "@src/api/interface/allRideInterface";



export const allRide = createAsyncThunk(
  ALLRIDE,
  async ({ ride_id }: { ride_id: number }) => {
    const response = await allRideService.allRide(ride_id);
    return {
      data: response.data,
      status: response.status,
    };

  }
);


export const allInvoice = createAsyncThunk(
  INVOICE,
  async ({ ride_number }: { ride_number: number }) => {
    const response = await allRideService.allInvoice(ride_number);
    return response?.data;
  }
);


export const allRides = createAsyncThunk(ALLRIDES, async () => {
  const response = await allRideService.allRides();
  return response?.data;
},
);


export const allpayment = createAsyncThunk(
  PAYMENT_AMOUNT,
  async (data: PaymentInterface) => {
    const response = await allRideService.allpayment(data);
    return response?.data;
  }
);

export const rideDataPut = createAsyncThunk(
  RIDECOMPLETE,
  async ({ payload, ride_id }: { payload: UpdateRideInterface; ride_id: number }) => {
    const response = await allRideService.rideUpdate({ payload, ride_id });
    return response?.data;
  },
);

export const locationChanges = createAsyncThunk(
  LOCATION_CHANGES,
  async (data: PaymentInterface) => {
    const response = await allRideService.locationChanges(data);
    return response?.data;
  }
);
