import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { documentGet } from '../action/documentAction'
import { DocumentInterface } from '../../interface/documentinterface'

const initialState: DocumentInterface = {
  documentData: [],
  loading: false,
  success: false,
}

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(documentGet.pending, state => {
      state.loading = true
    })
    builder.addCase(
      documentGet.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.documentData = action.payload
        state.success = true
      },
    )
    builder.addCase(documentGet.rejected, state => {
      state.loading = false
      state.success = false
    })
  },
})

export default documentSlice.reducer
