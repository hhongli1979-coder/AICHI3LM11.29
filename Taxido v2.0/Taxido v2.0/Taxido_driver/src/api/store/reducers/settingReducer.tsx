import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  currencyDataGet,
  settingDataGet,
  languageDataGet,
  planDataGet,
  translateDataGet,
  taxidosettingDataGet,
} from '../action/settingAction'
import { CurrencyInterface } from '../../interface/settingInterface'

const initialState: CurrencyInterface = {
  currencyData: [],
  settingData: [],
  taxidoSettingData: [],
  languageData: [],
  planData: [],
  translateData: [],
  loading: false,
  success: false,
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(currencyDataGet.pending, state => {
        state.loading = true
      })

      .addCase(
        currencyDataGet.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false
          state.currencyData = action.payload
          state.success = true
        },
      )
      .addCase(currencyDataGet.rejected, state => {
        state.loading = false
        state.success = false
      })

      .addCase(settingDataGet.pending, state => {
        state.loading = true
      })
      .addCase(
        settingDataGet.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false
          state.settingData = action.payload
          state.success = true
        },
      )
      .addCase(settingDataGet.rejected, state => {
        state.loading = false
        state.success = false
      })

      .addCase(taxidosettingDataGet.pending, state => {
        state.loading = true
      })
      .addCase(
        taxidosettingDataGet.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false
          state.taxidoSettingData = action.payload
          state.success = true
        },
      )
      .addCase(taxidosettingDataGet.rejected, state => {
        state.loading = false
        state.success = false
      })

      .addCase(languageDataGet.pending, state => {
        state.loading = true
      })
      .addCase(
        languageDataGet.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false
          state.languageData = action.payload
          state.success = true
        },
      )
      .addCase(languageDataGet.rejected, state => {
        state.loading = false
        state.success = false
      })

      .addCase(planDataGet.pending, state => {
        state.loading = true
      })
      .addCase(planDataGet.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.planData = action.payload
        state.success = true
      })
      .addCase(planDataGet.rejected, state => {
        state.loading = false
        state.success = false
      })

      .addCase(translateDataGet.pending, state => {
        state.loading = true
      })
      .addCase(
        translateDataGet.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false
          state.translateData = action.payload
          state.success = true
        },
      )
      .addCase(translateDataGet.rejected, state => {
        state.loading = false
        state.success = false
      })
  },
})

export default settingSlice.reducer
