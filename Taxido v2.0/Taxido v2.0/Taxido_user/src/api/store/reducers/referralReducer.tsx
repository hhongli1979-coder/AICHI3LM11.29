import { createSlice } from "@reduxjs/toolkit";
import { referralData } from "../actions/referralAction";
import { ReferralInterface } from "../../interface/referralInterface";

const initialState: ReferralInterface = {
    referralList: [],
    success: false,
};

const rentalVehicleSlice = createSlice({
    name: "refer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(referralData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(referralData.fulfilled, (state, action) => {
            state.referralList = action.payload;

            state.loading = false;
        });
        builder.addCase(referralData.rejected, (state) => {
            state.loading = false;
            state.success = false;
        });
    },
});

export default rentalVehicleSlice.reducer;
