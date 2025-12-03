import { CANCELATION } from "../types/index";
import { cancelationServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const cancelationDataGet = createAsyncThunk(
  CANCELATION,
  async ({ ride_start }: { ride_start: string }) => {
    const response = await cancelationServices.cancelationData({ ride_start });
    return response?.data;
  },
);
