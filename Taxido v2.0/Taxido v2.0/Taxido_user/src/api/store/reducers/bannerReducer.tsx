import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { bannerDataGet } from '../actions/bannerActon';
import { BannerInterface } from '../../interface/bannerInterface';


const initialState: BannerInterface = {
  data: [],
  loading: false,
  success: false,
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(bannerDataGet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(bannerDataGet.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.data = action.payload; 
      state.success = true;
    });
    builder.addCase(bannerDataGet.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });
  }
});

export default bannerSlice.reducer;
