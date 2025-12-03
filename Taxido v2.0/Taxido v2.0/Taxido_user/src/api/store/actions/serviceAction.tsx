import { SERVICE } from "../types/index";
import { serviceServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const serviceDataGet = createAsyncThunk(SERVICE, async () => {
  const response = await serviceServices.serviceDataGet();  
    return response?.data;
},
);
