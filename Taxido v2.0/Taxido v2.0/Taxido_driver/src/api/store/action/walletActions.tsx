import {
  WALLET,
  PAYMENT,
  PURCHASE_PLAN,
  VERIFY_PAYMENT,
  WITHDRAW_PAYMENT,
  WITHDRAE_REQUEST,
  WALLET_TOPUP,
  PAYMENT_AMOUNT,
  FLEET_WALLET,
  FLEET_WITHDRAW_REQUEST,
  FLEET_WITHDRAW_PAYMENT,
} from '../types/index'
import { walletServices } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fleetWalletInterface,
  PaymentRideInterface,
  PaymentVerifyInterface,
  PurchasePlanDataInterface,
  WalletTopUpDatainterface,
} from '../../interface/walletInterface'

export const walletData = createAsyncThunk(WALLET, async () => {
  const response = await walletServices.walletData()
  return {
    data: response?.data,
    status: response?.status,
  }
})

export const paymentsData = createAsyncThunk(PAYMENT, async () => {
  const response = await walletServices.paymentData()
  return {
    data: response.data,
    status: response.status,
  }
})

export const withdrawRequestData = createAsyncThunk(
  WITHDRAE_REQUEST,
  async () => {
    const response = await walletServices.withdrawRequestData()
    return response?.data
  },
)

export const purchaseData = createAsyncThunk(
  PURCHASE_PLAN,
  async (data: PurchasePlanDataInterface) => {
    const response = await walletServices.purchaseData(data)
    return response?.data
  },
)

export const paymentVerify = createAsyncThunk(
  VERIFY_PAYMENT,
  async (data: PaymentVerifyInterface) => {
    const response = await walletServices.paymentVerify(data)
    return response?.data
  },
)

export const withdrawData = createAsyncThunk(
  WITHDRAW_PAYMENT,
  async (data: PaymentVerifyInterface) => {
    const response = await walletServices.withdrawData(data)
    return response?.data
  },
)

export const walletTopUpData = createAsyncThunk(
  WALLET_TOPUP,
  async (data: WalletTopUpDatainterface) => {
    const response = await walletServices.walletTopUpData(data)
    return response?.data
  },
)

export const allpayment = createAsyncThunk(
  PAYMENT_AMOUNT,
  async (data: PaymentRideInterface) => {
    const response = await walletServices.allpayment(data)
    return response?.data
  },
)


export const fleetWalletData = createAsyncThunk(FLEET_WALLET, async () => {
  const response = await walletServices.fleetWalletData()
  return {
    data: response?.data,
    status: response?.status,
  }
})

export const fleetWithdrawRequestData = createAsyncThunk(
  FLEET_WITHDRAW_REQUEST,
  async () => {
    const response = await walletServices.fleetWithdrawRequestData()
    return response?.data
  },
)

export const fleetWithdrawData = createAsyncThunk(
  FLEET_WITHDRAW_PAYMENT,
  async (data: fleetWalletInterface) => {
    const response = await walletServices.fleetWithdrawData(data)
    return response?.data
  },
)