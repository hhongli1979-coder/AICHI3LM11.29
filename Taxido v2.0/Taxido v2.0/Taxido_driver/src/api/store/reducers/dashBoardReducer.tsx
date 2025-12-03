import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dashBoardData } from '../action/dashBoardAction';
import { DashBoardInterface } from '../../interface/dashboardInterface';

const initialState: DashBoardInterface = {
    dashBoardList: [],
    success: false,
    loading: false,
    statusCode: null,
};

const dashBoardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(dashBoardData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(dashBoardData.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.dashBoardList = action.payload;
            state.statusCode = action.payload.status;
            state.loading = false;
        });
        builder.addCase(dashBoardData.rejected, (state) => {
            state.loading = false;
            state.success = false;
            state.statusCode = action.payload?.status || 500;
        });
    },
});


export default dashBoardSlice.reducer;
