import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { notificationDataGet } from '../actions/notificationAction';
import { NotificationInterface } from '../../interface/notificationInterface';


const initialState: NotificationInterface = {
    notificationList: [],
    loading: false,
    success: false,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(notificationDataGet.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(notificationDataGet.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.notificationList = action.payload;
            state.success = true;
        });
        builder.addCase(notificationDataGet.rejected, (state) => {
            state.loading = false;
            state.success = false;
        });
    }
});

export default notificationSlice.reducer;
