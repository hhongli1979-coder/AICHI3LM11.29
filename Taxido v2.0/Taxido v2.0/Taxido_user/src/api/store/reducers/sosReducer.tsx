import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sosData, sosAlertData } from '../actions/sosAction'
import { SOSInterface } from '../../interface/sosInterface';


const initialState: SOSInterface = {
    sosValue: [],
    sosAlertvalue: [],
    token: '',
    loading: false,
    success: false,
    fcmToken: '',
};



const sosSlice = createSlice({
    name: 'sos',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(sosData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(sosData.fulfilled, (state, action) => {
            state.sosValue = action.payload;
            state.loading = false;
        });

        //sos alert
        builder.addCase(sosAlertData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(sosAlertData.fulfilled, (state, action) => {
            state.sosAlertvalue = action.payload;
            state.loading = false;
        });
    }
});
export default sosSlice.reducer;