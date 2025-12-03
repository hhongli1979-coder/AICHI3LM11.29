import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { incentivesValue } from '../action/incentiveAction';
import { IncentiveInterface } from '../../interface/incentiveInterface';

const initialState: IncentiveInterface = {
    incentiveDataList: [],
    success: false,
    loading: false,
    statusCode: null,
};

const homescreenSlice = createSlice({
    name: 'incentives',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(incentivesValue.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(incentivesValue.fulfilled, (state: any, action: PayloadAction<any>) => {
            state.incentiveDataList = action.payload;
            state.statusCode = action.payload.status;
            state.loading = false;
        });
        builder.addCase(incentivesValue.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.success = false;
            state.statusCode = action.payload?.status || 500;
        });

    },

});

export default homescreenSlice.reducer;
