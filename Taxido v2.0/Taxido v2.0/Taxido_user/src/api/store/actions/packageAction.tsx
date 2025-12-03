import { PACKAGE } from "../types/index";
import { packageServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const packageDataGet = createAsyncThunk(PACKAGE, async (data: number) => {
  const response = await packageServices.packageDataGet(data.zone_id);
  return response?.data;
},
);
