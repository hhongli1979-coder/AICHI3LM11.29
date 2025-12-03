import { createSlice } from '@reduxjs/toolkit'
import { notificationData } from '../action/notificationAction'
import { NotificationInterface } from '../../interface/notificationInterface'

const initialState: NotificationInterface = {
  notificationList: [],
  loading: false,
  success: false,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(notificationData.pending, state => {
      state.loading = true
    })
    builder.addCase(notificationData.fulfilled, (state, action) => {
      state.notificationList = action.payload
      state.loading = false
    })
    builder.addCase(notificationData.rejected, state => {
      state.loading = false
      state.success = false
    })
  },
})

export default notificationSlice.reducer
