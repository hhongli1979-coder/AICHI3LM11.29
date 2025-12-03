import { BID, BIDUPDATE } from "../types/index";
import { BidInterface } from "../../interface/bidInterface";
import { createAsyncThunk } from '@reduxjs/toolkit';
import bidServices from "../../services/bidService";

interface BidInterfaces {
  ride_request_id: number;
}

export const bidDataGet = createAsyncThunk(
  BID,
  async ({ride_request_id}:{ride_request_id:number}) => {
    const response = await bidServices.bidDataGet({ride_request_id});
    return response?.data;
  },
);


export const bidUpdate = createAsyncThunk(
  BIDUPDATE,
  async ({ payload, bid_id }: { payload: any; bid_id: number }) => {
    const response = await bidServices.bidUpdate({ payload, bid_id });
    return response?.data;
  }
);
