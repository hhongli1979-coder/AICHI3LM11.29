export interface WalletTypeInterface {
  success?: boolean;
  walletTypedata?: WalletTypeDataInterface | [];
  walletTopup?: WalletTopUpDatainterface | [];
  loading?: boolean;
  token?: string | null | undefined;
  fcmToken?: string | null | undefined;
  statusCode?: undefined | null | number
}

export interface WalletTypeDataInterface {
  id: number;
  rider_id: number;
  balance: number;
  histories: HistoriesInterface;
}

export interface HistoriesInterface {
  current_page: number;
  data: HistoriesDataInterface;
}

export interface HistoriesDataInterface {
  id: number;
  rider_wallet_id: number;
  ride_id: number;
  amount: number;
  type: string;
  detail: string;
  from_user_id: number;
  created_at: string;
}

export interface WalletTopUpDatainterface {
  amount: number;
  payment_method: string;
}
