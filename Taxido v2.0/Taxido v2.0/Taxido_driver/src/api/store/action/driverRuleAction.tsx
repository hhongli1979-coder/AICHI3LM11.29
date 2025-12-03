import { DRIVER_RULE } from '../types/index'
import { driverRuleServices } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const driverRuleGet = createAsyncThunk(DRIVER_RULE, async () => {
  const response = await driverRuleServices.driverRuleType()
  return response?.data
})
