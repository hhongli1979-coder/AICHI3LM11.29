import { BID, BIDGET } from '../types/index'
import { BidInterface } from '../../interface/bidInterface'
import { createAsyncThunk } from '@reduxjs/toolkit'
import bidServices from '../../services/bidService'

export const bidDataPost = createAsyncThunk(BID, async (data: BidInterface) => {
  const response = await bidServices.bidDataPost(data)
  return response?.data
})

export const bidDataGet = createAsyncThunk(BIDGET, async (bid_id: number) => {
  const response = await bidServices.bidDataGet(bid_id)
  return response?.data
})
