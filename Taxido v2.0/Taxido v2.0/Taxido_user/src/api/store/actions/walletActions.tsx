import { Wallet, WALLET_TOPUP } from "../types/index";
import { walletServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { WalletTopUpDatainterface } from '../../interface/walletInterface';


export const walletData = createAsyncThunk(Wallet, async () => {
  const response = await walletServices.walletData();
  return response?.data;
},
);


export const walletTopUpData = createAsyncThunk(
  WALLET_TOPUP,
  async (data: WalletTopUpDatainterface) => {
    const response = await walletServices.walletTopUpData(data);
    return response?.data;
  }
);