import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { serviceDataGet } from '../actions/serviceAction';
import { ServiceInterface } from '../../interface/serviceInterface';


const initialState: ServiceInterface = {
    serviceData: [],
    loading: false,
    success: false,
};

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(serviceDataGet.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(serviceDataGet.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.serviceData = action.payload;
            state.success = true;
        });
        builder.addCase(serviceDataGet.rejected, (state) => {
            state.loading = false;
            state.success = false;
        });
    }
});

export default serviceSlice.reducer;
