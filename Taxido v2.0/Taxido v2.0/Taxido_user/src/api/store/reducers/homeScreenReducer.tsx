import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { homeScreenData, homeScreenPrimary } from '../actions/homeScreenAction';
import { HomeScreenInterface } from '../../interface/homeScreenInterface';

const initialState: HomeScreenInterface = {
    homeScreenData: [],
    homeScreenDataPrimary: [],
    success: false,
    loading: false,
    statusCode: null,
};

const homescreenSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearHomePrimaryData: (state) => {
            state.homeScreenDataPrimary = [];
        }
    },
    extraReducers: builder => {
        builder.addCase(homeScreenData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(homeScreenData.fulfilled, (state: any, action: PayloadAction<any>) => {
            state.homeScreenData = action.payload;
            state.statusCode = action.payload.status;
            state.loading = false;
        });
        builder.addCase(homeScreenData.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.success = false;
            state.statusCode = action.payload?.status || 500;
        });


        // home primary
        builder.addCase(homeScreenPrimary.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(homeScreenPrimary.fulfilled, (state, action: PayloadAction<any>) => {
            state.homeScreenDataPrimary = action.payload;
            state.statusCode = action.payload.status;
            state.loading = false;
        });
        builder.addCase(homeScreenPrimary.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.success = false;
            state.statusCode = action.payload?.status || 500;
        });
    },

});

export const { clearHomePrimaryData } = homescreenSlice.actions;


export default homescreenSlice.reducer;
