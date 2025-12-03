import { createSlice } from '@reduxjs/toolkit'
import { bidDataPost, bidDataGet } from '../action/bidAction'
import { BidInterface } from '../../interface/bidInterface'

const initialState: BidInterface = {
  bidValue: [],
  bidGet: [],
  token: '',
  loading: false,
  success: false,
  fcmToken: '',
}

const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    resetBidGet: (state) => {
      state.bidGet = null;
    },
  }, extraReducers: builder => {
    builder.addCase(bidDataPost.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(bidDataPost.fulfilled, (state, action) => {
      state.bidValue = action.payload
      state.loading = false
    })

    builder.addCase(bidDataGet.pending, state => {
      state.loading = true
    })
    builder.addCase(
      bidDataGet.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.bidGet = action.payload
        state.loading = false
      },
    )
    builder.addCase(bidDataGet.rejected, state => {
      state.loading = false
      state.success = false
    })
  },
})

export const { resetBidGet } = bidSlice.actions;
export default bidSlice.reducer
