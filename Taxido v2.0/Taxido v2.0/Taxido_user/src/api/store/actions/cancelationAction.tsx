import { CANCELATION } from "../types/index";
import { cancelationServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const cancelationDataGet = createAsyncThunk(CANCELATION, async () => {
  const response = await cancelationServices.cancelationData();
  return response?.data;
},
);
