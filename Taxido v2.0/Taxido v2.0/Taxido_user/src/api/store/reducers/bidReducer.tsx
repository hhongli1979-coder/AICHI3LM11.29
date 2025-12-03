import { createSlice } from '@reduxjs/toolkit';
import { bidDataGet, bidUpdate } from '../actions/bidAction'
import { BidInterface } from '../../interface/bidInterface';


const initialState: BidInterface = {
    bidValue: [],
    bidUpdateData: [],
    token: '',
    loading: false,
    success: false,
    fcmToken: '',
};



const bidSlice = createSlice({
    name: 'bid',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(bidDataGet.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(bidDataGet.fulfilled, (state, action) => {
            state.bidValue = action.payload;
            state.loading = false;
        });

        builder.addCase(bidDataGet.rejected, (state, action) => {
            state.loading = false;
        });

        //Update bid
        builder.addCase(bidUpdate.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(bidUpdate.fulfilled, (state, action) => {
            state.bidUpdateData = action.payload;
            state.loading = false;
        });
        builder.addCase(bidUpdate.rejected, (state, action) => {
            state.loading = false;
        });
    }
});
export default bidSlice.reducer;