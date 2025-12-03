import { AMBULANCE_LIST, AMBULANCE_BOOK } from "../types/index";
import { AmbulanceInterface, ambulanceRequestInterface } from "../../interface/ambulanceInterface";
import { createAsyncThunk } from '@reduxjs/toolkit';
import ambulanceServices from "../../services/ambulanceService";


export const ambulanceAction = createAsyncThunk(
    AMBULANCE_LIST,
    async (data: AmbulanceInterface | any) => {
        const response = await ambulanceServices.ambulanceList(data.lat, data.lng);
        return response?.data;
    },
);

export const ambulancebook = createAsyncThunk(
    AMBULANCE_BOOK,
    async (data: ambulanceRequestInterface) => {
        const response = await ambulanceServices.ambulancebook(data);
        return {
            data: response.data,
            status: response.status,
        };
    }
);