import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { driverRuleGet } from '../action/driverRuleAction'
import { DriverRuleInterface } from '../../interface/driverRuleInterface'

const initialState: DriverRuleInterface = {
  driverRulesData: [],
  loading: false,
  success: false,
}

const driverRuleSlice = createSlice({
  name: 'driverRule',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(driverRuleGet.pending, state => {
      state.loading = true
    })
    builder.addCase(
      driverRuleGet.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.driverRulesData = action.payload
        state.success = true
      },
    )
    builder.addCase(driverRuleGet.rejected, state => {
      state.loading = false
      state.success = false
    })
  },
})

export default driverRuleSlice.reducer
