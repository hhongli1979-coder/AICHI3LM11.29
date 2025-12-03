import { createSlice } from "@reduxjs/toolkit";
import {
  selfData,
  updateProfile,
  accountDelete,
  countryData,
  updateMobileEmail,
  verifyMobileEmail
} from "../actions/accountAction";

const initialState = {
  loading: false,
  self: [],
  selfStatus: null,
  defaultAddress: null,
  accountDetails: null,
  countryList: [],
  updateMobileEmailData: [],
  verifyMobileEmailData: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {

    updateDefaultAdd(state, action) {
      state.defaultAddress = action.payload;
    },
    financialState(state: any, action) {
      state.val = action.payload;
    },
    updateLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    //Self Cases
    builder.addCase(selfData.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(selfData.fulfilled, (state, action) => {
      state.self = action.payload?.data;
      action?.payload?.address?.map((item: any) => {
        if (item.is_default == 1) state.defaultAddress = item;
      });
      state.loading = false;
    });
    builder.addCase(selfData.rejected, (state, action) => {
      state.loading = false;
    });

    //UpdateProfile Cases
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => { });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
    });

    //Delete Account
    builder.addCase(accountDelete.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(accountDelete.fulfilled, (state, action) => { });
    builder.addCase(accountDelete.rejected, (state, action) => {
      state.loading = false;
    });

    //mobile or email update
    builder.addCase(updateMobileEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateMobileEmail.fulfilled, (state, action) => {
      state.updateMobileEmailData = action.payload;
    });
    builder.addCase(updateMobileEmail.rejected, (state, action) => {
      state.loading = false;
    });

    //Verify mobile or email update
    builder.addCase(verifyMobileEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(verifyMobileEmail.fulfilled, (state, action) => {
      state.verifyMobileEmailData = action.payload;
    });
    builder.addCase(verifyMobileEmail.rejected, (state, action) => {
      state.loading = false;
    });

    //Country List
    builder.addCase(countryData.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(countryData.fulfilled, (state, action) => {
      state.countryList = action.payload;
    });
    builder.addCase(countryData.rejected, (state, action) => {
      state.loading = false;
    });

  },
});

export const { updateDefaultAdd, financialState, updateLoading } =
  accountSlice.actions;
export default accountSlice.reducer;
