import { NOTIFICATION } from "../types/index";
import { notificationServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const notificationDataGet = createAsyncThunk(NOTIFICATION, async () => {
  const response = await notificationServices.notificationDataGet();
  return response?.data;
},
);
