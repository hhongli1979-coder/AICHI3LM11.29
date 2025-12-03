import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { couponListData, couponVerifyData } from '../actions/couponAction';
import { CouponsInterface } from '../../interface/couponInterface';

const initialState: CouponsInterface = {
    couponsList: [],
    couponsverify: [],
    success: false,
    loading: false,
    statusCode: null,
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(couponListData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(couponListData.fulfilled, (state: any, action: PayloadAction<any[]>) => {
            state.couponsList = action.payload;
            state.statusCode = action.payload.status;
            state.loading = false;
        });
        builder.addCase(couponListData.rejected, (state: any) => {
            state.loading = false;
            state.success = false;
            state.statusCode = action.payload?.status || 500;
        });

        //coupon verify
        builder.addCase(couponVerifyData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(couponVerifyData.fulfilled, (state, action) => {
            state.couponsverify = action.payload;
            state.loading = false;
        });
        builder.addCase(couponVerifyData.rejected, (state, action) => {
            state.loading = false;
        });
    },

});

export default couponSlice.reducer;
