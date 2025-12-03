import { COUPON, COUPONVERIFY } from '../types'
import { couponService } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CouponsVerifyInterface } from '@src/api/interface/couponInterface';


export const couponListData = createAsyncThunk(
    COUPON,
    async (data: any) => {
        const response = await couponService.couponListData();
        return response?.data;
    },
);

export const couponVerifyData = createAsyncThunk(
    COUPONVERIFY,
    async (data: CouponsVerifyInterface) => {
        const response = await couponService.couponVerifyData(data);
        return response?.data;
    },
);
