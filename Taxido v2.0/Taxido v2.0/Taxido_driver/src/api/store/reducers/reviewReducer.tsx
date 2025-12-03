import { createSlice } from '@reduxjs/toolkit'
import { userReview } from '../action/reviewAction'
import { ReviewInterface } from '../../interface/reviewInterface'

const initialState: ReviewInterface = {
  reviews: [],
  loading: false,
  success: false,
}

const reviewSlice = createSlice({
  name: 'reviewPost',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(userReview.pending, state => {
      state.loading = true
    })
    builder.addCase(userReview.fulfilled, (state, action) => {
      state.reviews = action.payload
      state.loading = false
    })
    builder.addCase(userReview.rejected, state => {
      state.loading = false
      state.success = false
    })
  },
})

export default reviewSlice.reducer
