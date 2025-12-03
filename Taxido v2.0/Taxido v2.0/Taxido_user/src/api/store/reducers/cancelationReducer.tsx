import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cancelationDataGet } from '../actions/cancelationAction';
import { CancelationInterface } from '../../interface/cancelationInterface';


const initialState: CancelationInterface = {
  canceldata: [],
  loading: false,
  success: false,
};

const bannerSlice = createSlice({
  name: 'cancelationReason',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(cancelationDataGet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(cancelationDataGet.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.canceldata = action.payload; 
      state.success = true;
    });
    builder.addCase(cancelationDataGet.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });
  }
});

export default bannerSlice.reducer;
