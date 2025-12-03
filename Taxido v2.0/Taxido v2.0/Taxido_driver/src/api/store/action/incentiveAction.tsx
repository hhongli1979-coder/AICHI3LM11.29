import { INCENTIVE } from '../types'
import { incentiveService } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit';


export const incentivesValue = createAsyncThunk(
    INCENTIVE,
    async ({ incentivedate }: { incentivedate: string }) => {
        const response = await incentiveService.incentivesValue({ incentivedate });
        return response?.data;
    },
);
