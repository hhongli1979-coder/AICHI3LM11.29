import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {allDriver} from '../actions/allDriverAction'
import { DriverInterface } from '../../interface/allDriverInterface';


const initialState: DriverInterface = {
    driverData: [],
    token: '',
    loading: false,
    success: false,
    fcmToken: '',
};



const zoneSlice = createSlice({
    name: 'allDriver',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(allDriver.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(allDriver.fulfilled, (state, action) => {
            state.driverData = action.payload; 
            state.loading = false;
        });
    }
});
export default zoneSlice.reducer;