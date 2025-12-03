import { BANNER } from "../types/index";
import { bannerService } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const bannerDataGet = createAsyncThunk(BANNER, async () => {
  const response = await bannerService.bannerDataGet();
  return response?.data;
},
);
