import { NOTIFICATION } from '../types/index'
import { notificationService } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const notificationData = createAsyncThunk(NOTIFICATION, async () => {
  const response = await notificationService.notificationData()
  return response?.data
})
