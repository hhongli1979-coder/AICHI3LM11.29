import { HOMESCREEN, HOMESCREEN_PRIMARY } from '../types'
import { homeScreenService } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit';


export const homeScreenData = createAsyncThunk(
    HOMESCREEN,
    async ({ service }: { service: number }) => {
        const response = await homeScreenService.homeScreenData({ service });
        return response?.data;
    },
);



export const homeScreenPrimary = createAsyncThunk(
    HOMESCREEN_PRIMARY,
    async () => {
        const response = await homeScreenService.homeScreenPrimary();
        return response?.data;
    },
);