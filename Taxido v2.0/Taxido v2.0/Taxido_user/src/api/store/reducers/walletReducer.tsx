import { createSlice } from '@reduxjs/toolkit';
import { walletData, walletTopUpData } from '../actions/walletActions'
import { WalletTypeInterface } from '../../interface/walletInterface';


const initialState: WalletTypeInterface = {
  walletTypedata: [],
  walletTopup: [],
  token: '',
  loading: false,
  success: false,
  fcmToken: '',
  statusCode: null,
};


const walletTypeSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(walletData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(walletData.fulfilled, (state, action) => {
      state.walletTypedata = action.payload;
      state.statusCode = action.payload.status;
      state.loading = false;
    });
    builder.addCase(walletData.rejected, (state, action: any) => {
      state.walletTypedata = action.payload.data;
      state.statusCode = action.payload?.status || 500;
      state.loading = false;
      state.success = false;
    });


    builder.addCase(walletTopUpData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(walletTopUpData.fulfilled, (state, action: any) => {
      state.walletTopup = action.payload;
      state.loading = false;
    });
    builder.addCase(walletTopUpData.rejected, (state, action: any) => {
      state.walletTopup = action.payload.data;
      state.loading = false;
      state.success = false;
    });


  }
});

export default walletTypeSlice.reducer;
