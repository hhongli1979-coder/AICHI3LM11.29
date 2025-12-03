import { createSlice } from '@reduxjs/toolkit';
import {userZone} from '../actions/zoneActions'
import { ZoneInterface } from '../../interface/zoneInterface';


const initialState: ZoneInterface = {
    zoneValue: [],
    token: '',
    loading: false,
    success: false,
    fcmToken: '',
};



const zoneSlice = createSlice({
    name: 'zone',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(userZone.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(userZone.fulfilled, (state, action) => {
            state.zoneValue = action.payload; 
            state.loading = false;
        });
    }
});
export default zoneSlice.reducer;