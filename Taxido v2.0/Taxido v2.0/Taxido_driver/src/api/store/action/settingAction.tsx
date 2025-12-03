import {
  CURRENCY,
  LANGUAGE,
  SETTING,
  PLANS,
  TRANSLATE,
  TAXIDOSETTING,
} from '../types/index'
import settingServices from '../../services/settingService'
import { createAsyncThunk } from '@reduxjs/toolkit'

// Fetching currency data
export const currencyDataGet = createAsyncThunk(CURRENCY, async () => {
  const response = await settingServices.currencyDataGet()
  return response?.data
})

// Fetching address data
export const addressDataGet = createAsyncThunk(CURRENCY, async () => {
  const response = await settingServices.addressDataGet()
  return response?.data
})

// Fetching setting data
export const settingDataGet = createAsyncThunk(SETTING, async () => {
  const response = await settingServices.settingDataGet();
  if (response?.data && typeof response.data === 'object') {
    response.data._status = response.status;
  }

  return response?.data;
});

// Fetching Taxido setting data
export const taxidosettingDataGet = createAsyncThunk(
  TAXIDOSETTING,
  async () => {
    const response = await settingServices.taxidosettingDataGet()
    return response?.data
  },
)

// Fetching Language data
export const languageDataGet = createAsyncThunk(LANGUAGE, async () => {
  const response = await settingServices.languageDataGet()
  return response?.data
})

// Fetching plan data
export const planDataGet = createAsyncThunk(PLANS, async () => {
  const response = await settingServices.planDataGet()
  return response?.data
})

//translate data get
export const translateDataGet = createAsyncThunk(TRANSLATE, async () => {
  const response = await settingServices.translateDataGet()
  return response?.data
})
