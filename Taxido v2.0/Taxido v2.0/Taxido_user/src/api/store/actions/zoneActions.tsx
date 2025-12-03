import { User_Zone } from "../types/index";
import { ZoneInterface } from "../../interface/zoneInterface";
import { createAsyncThunk } from '@reduxjs/toolkit';
import zoneServices from "../../services/zoneService";


export const userZone = createAsyncThunk(
  User_Zone,
  async (data: ZoneInterface | any) => {
    const response = await zoneServices.userZone(data.lat, data.lng);
    return response?.data;
  },
);
