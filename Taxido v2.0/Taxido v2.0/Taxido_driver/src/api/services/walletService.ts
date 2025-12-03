import {
  riderWallet, payment, plan_purchase, verify_payment, withdraw, withdrawRequest, topUpWallet, paymentRide,
  fleetWallet, fleetWithdraw, fleetWithdrawRequest
} from '../endpoints/walletEndpoint'
import { PaymentVerifyInterface, PurchasePlanDataInterface, WithdrawDataInterface, WalletTopUpDatainterface, PaymentRideInterface, fleetWalletInterface } from '../interface/walletInterface'
import { GET_API, POST_API } from '../methods'

export const walletData = async () => {
  return GET_API(riderWallet)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const paymentData = async () => {
  return GET_API(payment)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const withdrawRequestData = async () => {
  return GET_API(withdrawRequest)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const purchaseData = async (data: PurchasePlanDataInterface) => {
  return POST_API(data, plan_purchase)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const paymentVerify = async (data: PaymentVerifyInterface) => {
  return POST_API(data, verify_payment)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const withdrawData = async (data: WithdrawDataInterface) => {
  return POST_API(data, withdraw)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const walletTopUpData = async (data: WalletTopUpDatainterface) => {
  return POST_API(data, topUpWallet)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const allpayment = async (data: PaymentRideInterface) => {
  return POST_API(data, paymentRide)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

//fleet 

export const fleetWalletData = async () => {
  return GET_API(fleetWallet)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const fleetWithdrawData = async (data: fleetWalletInterface) => {
  return POST_API(data, fleetWithdraw)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const fleetWithdrawRequestData = async () => {
  return GET_API(fleetWithdrawRequest)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const walletServices = {
  walletData,
  paymentData,
  purchaseData,
  paymentVerify,
  withdrawData,
  withdrawRequestData,
  walletTopUpData,
  allpayment,
  fleetWalletData,
  fleetWithdrawData,
  fleetWithdrawRequestData
}
export default walletServices
