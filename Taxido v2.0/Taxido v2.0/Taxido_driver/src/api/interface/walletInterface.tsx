export interface WalletTypeInterface {
  success?: boolean
  walletTypedata?: WalletTypeDataInterface
  paymentMethodData?: PaymentMethodDataInterface
  purchasePlanData?: PurchasePlanDataInterface
  paymentVerifyData?: PaymentVerifyInterface
  withdrawAmountData?: WithdrawDataInterface
  withdrawRequestValue?: WithdrawRequestDataInterface
  topupData?: WalletTopUpDatainterface
  paymentData?: PaymentRideInterface
  fleetwalletTypedata?: WalletTypeDataInterface
  fleetwithdrawAmountData?: WithdrawDataInterface
  fleetwithdrawRequestValue?: WithdrawRequestDataInterface
  loading?: boolean
  statusCode?: number
}

export interface WalletTypeDataInterface {
  id: number
  rider_id: number
  balance: number
  histories: HistoriesInterface
}

export interface HistoriesInterface {
  current_page: number
  data: HistoriesDataInterface
}

export interface HistoriesDataInterface {
  id: number
  rider_wallet_id: number
  ride_id: number
  amount: number
  type: string
  detail: string
  from_user_id: number
  created_at: string
}

export interface PaymentMethodDataInterface {
  name: string
  slug: string
  image: string
  status: boolean
}

export interface PurchasePlanDataInterface {
  plan_id: number
  payment_method: any
}

export interface PaymentVerifyInterface {
  item_id: number
  type: string
  transaction_id?: string
}

export interface WithdrawDataInterface {
  amount: number
  message: string
  payment_type: string
}

export interface WithdrawRequestDataInterface { }

export interface WalletTopUpDatainterface { }

export interface PaymentRideInterface { }

export interface fleetWalletInterface {

}