import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  walletData,
  paymentsData,
  purchaseData,
  paymentVerify,
  withdrawData,
  withdrawRequestData,
  walletTopUpData,
  allpayment,
  fleetWalletData,
  fleetWithdrawData,
  fleetWithdrawRequestData
} from '../action/walletActions'
import { WalletTypeInterface } from '../../interface/walletInterface'

const initialState: WalletTypeInterface = {
  walletTypedata: [],
  paymentMethodData: [],
  purchasePlanData: [],
  paymentVerifyData: [],
  withdrawAmountData: [],
  withdrawRequestValue: [],
  paymentData: [],
  topupData: [],
  token: '',
  loading: false,
  success: false,
  fcmToken: '',
  statusCode: null,
  fleetwalletTypedata: [],
  fleetwithdrawAmountData: [],
  fleetwithdrawRequestValue: [],
}

const walletTypeSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(walletData.pending, state => {
      state.loading = true
    })
    builder.addCase(walletData.fulfilled, (state, action) => {
      state.walletTypedata = action.payload.data
      state.statusCode = action.payload.status
      state.loading = false
    })
    builder.addCase(walletData.rejected, (state, action) => {
      state.walletTypedata = action.payload.data
      state.statusCode = action.payload?.status || 500
      state.loading = false
      state.success = false
    })

    builder.addCase(paymentsData.pending, state => {
      state.loading = true
      state.success = false
    })

    builder.addCase(
      paymentsData.fulfilled,
      (
        state,
        action: PayloadAction<{ data: any[]; status: number; state; action }>,
      ) => {
        state.loading = false
        state.paymentMethodData = action.payload.data
        state.statusCode = action.payload.status
        state.success = true
      },
    )
    builder.addCase(paymentsData.rejected, state => {
      state.loading = false
      state.success = false
    })

    builder.addCase(withdrawRequestData.pending, state => {
      state.loading = true
      state.success = false
    })
    builder.addCase(withdrawRequestData.fulfilled, (state, action) => {
      state.withdrawRequestValue = action.payload
      state.loading = false
      state.statusCode = action.payload.status
      state.success = true
    })
    builder.addCase(withdrawRequestData.rejected, state => {
      state.loading = false
      state.success = false
    })

    builder.addCase(purchaseData.pending, state => {
      state.loading = true
      state.success = false
    })
    builder.addCase(purchaseData.fulfilled, (state, action) => {
      state.purchasePlanData = action.payload
      state.loading = false
      state.success = true
    })
    builder.addCase(purchaseData.rejected, state => {
      state.loading = false
      state.success = false
    })

    builder.addCase(paymentVerify.pending, state => {
      state.loading = true
      state.success = false
    })
    builder.addCase(paymentVerify.fulfilled, (state, action) => {
      state.paymentVerifyData = action.payload
      state.loading = false
      state.success = true
    })
    builder.addCase(paymentVerify.rejected, state => {
      state.loading = false
      state.success = false
    })

    builder.addCase(withdrawData.pending, state => {
      state.loading = true
      state.success = false
    })
    builder.addCase(withdrawData.fulfilled, (state, action) => {
      state.withdrawAmountData = action.payload
      state.loading = false
      state.statusCode = action.payload.status
      state.success = true
    })
    builder.addCase(withdrawData.rejected, state => {
      state.loading = false
      state.success = false
    })

    //topup
    builder.addCase(walletTopUpData.pending, state => {
      state.loading = true
    })
    builder.addCase(walletTopUpData.fulfilled, (state, action) => {
      state.topupData = action.payload
      state.loading = false
    })
    builder.addCase(walletTopUpData.rejected, state => {
      state.topupData = action.payload.data
      state.loading = false
      state.success = false
    })

    //payment
    builder.addCase(allpayment.pending, state => {
      state.loading = true
    })
    builder.addCase(allpayment.fulfilled, (state, action) => {
      state.paymentData = action.payload
      state.loading = false
      state.success = true
    })
    builder.addCase(allpayment.rejected, state => {
      state.loading = false
      state.success = false
    })

    //fleet

    builder.addCase(fleetWalletData.pending, state => {
      state.loading = true
    })
    builder.addCase(fleetWalletData.fulfilled, (state, action) => {
      state.fleetwalletTypedata = action.payload.data
      state.statusCode = action.payload.status
      state.loading = false
    })
    builder.addCase(fleetWalletData.rejected, (state, action) => {
      state.fleetwalletTypedata = action.payload.data
      state.statusCode = action.payload?.status || 500
      state.loading = false
      state.success = false
    })



    builder.addCase(fleetWithdrawData.pending, state => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fleetWithdrawData.fulfilled, (state, action) => {
      state.fleetwithdrawAmountData = action.payload
      state.loading = false
      state.statusCode = action.payload.status
      state.success = true
    })
    builder.addCase(fleetWithdrawData.rejected, state => {
      state.loading = false
      state.success = false
    })


    builder.addCase(fleetWithdrawRequestData.pending, state => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fleetWithdrawRequestData.fulfilled, (state, action) => {
      state.fleetwithdrawRequestValue = action.payload
      state.loading = false
      state.statusCode = action.payload.status
      state.success = true
    })
    builder.addCase(fleetWithdrawRequestData.rejected, state => {
      state.loading = false
      state.success = false
    })
  },
})

export default walletTypeSlice.reducer
