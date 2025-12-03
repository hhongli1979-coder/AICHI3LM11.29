import { DASHBOARD } from '../types'
import { dashBoardService } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit';


export const dashBoardData = createAsyncThunk(
    DASHBOARD,
    async ({ unit, zoneId, driver_id }: { unit: number, zoneId: number, driver_id: number }) => {
        const response = await dashBoardService.dashBoardData({ unit, zoneId, driver_id });
        return response?.data;
    },
);

