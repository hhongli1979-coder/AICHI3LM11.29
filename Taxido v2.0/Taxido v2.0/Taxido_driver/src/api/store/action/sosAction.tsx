import { SOS, SOS_ALERT } from '../types/index'
import sosServices from '../../services/sosService'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { sosAlertDataInterface } from '../../interface/sosInterface'

// Fetching sos data
export const sosDataGet = createAsyncThunk(SOS, async () => {
    const response = await sosServices.sosDataGet()
    return response?.data
})

export const sosAlertGet = createAsyncThunk(SOS_ALERT, async (data: sosAlertDataInterface) => {
    const response = await sosServices.sosAlertGet(data)
    return response?.data
})
