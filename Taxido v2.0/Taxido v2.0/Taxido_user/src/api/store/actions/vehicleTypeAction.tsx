import { VEHICLE_TYPE, ALL_VEHICLE } from "../types/index";
import { vehicleTypeService, } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { VehicleTypeInterface } from '../../interface/vehicleTypeInterface';

export const vehicleTypeDataGet = createAsyncThunk(
  VEHICLE_TYPE,
  async (data: VehicleTypeInterface) => {
    const response = await vehicleTypeService.vehicleTypes(data);
    return response?.data;
  }
);


export const vehicleData = createAsyncThunk(ALL_VEHICLE, async () => {
  const response = await vehicleTypeService.allVehicleData();  
  return response?.data;
},
);
