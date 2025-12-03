import { DOCUMENT } from '../types/index'
import { documentServices } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const documentGet = createAsyncThunk(DOCUMENT, async ({ type }: { type: string }) => {
  const response = await documentServices.documentType({ type })
  return response?.data
})
