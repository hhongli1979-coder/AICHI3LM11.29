import { ALLDRIVER } from "../types/index";
import { DriverInterface } from "../../interface/allDriverInterface";
import { createAsyncThunk } from '@reduxjs/toolkit';
import allDriverServices from "@src/api/services/allDriverServices";

  export const allDriver = createAsyncThunk(
    ALLDRIVER,
    async (data: DriverInterface) => {
        const response = await allDriverServices.allDriver(data.zones, data.is_online, data.is_on_ride);
        return response?.data;
    },
);
