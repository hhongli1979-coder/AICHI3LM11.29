import { REVIEW } from '../types/index'
import { ReviewInterface } from '../../interface/reviewInterface'
import { reviewService } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const userReview = createAsyncThunk(
  REVIEW,
  async (data: ReviewInterface) => {
    const response = await reviewService.review(data)
    return response?.data
  },
)
