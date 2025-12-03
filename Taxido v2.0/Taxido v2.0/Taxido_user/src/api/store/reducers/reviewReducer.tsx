import { createSlice } from '@reduxjs/toolkit';
import { driverReviewPost } from '../actions/reviewAction'
import { DriverReviewDataInterface } from '../../interface/reviewInterface';


const initialState: DriverReviewDataInterface = {
  DriverReview: [],
  token: '',
  loading: false,
  success: false,
  fcmToken: '',
};


const reviewSlice = createSlice({
  name: 'DriverReviews',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(driverReviewPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(driverReviewPost.fulfilled, (state, action) => {
      state.DriverReview = action.payload;
      state.loading = false;
    });
    builder.addCase(driverReviewPost.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });
  }
});

export default reviewSlice.reducer;
