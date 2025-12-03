import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sosDataGet, sosAlertGet } from '../action/sosAction'
import { sosDataInterface } from '../../interface/sosInterface'

const initialState: sosDataInterface = {
    sosData: [],
    sosAlert: [],
    loading: false,
    success: false,
    statusCode: null,
}

const sosSlice = createSlice({
    name: 'sos',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(sosDataGet.pending, state => {
            state.loading = true
        })
        builder.addCase(
            sosDataGet.fulfilled,
            (state, action: PayloadAction<any[]>) => {
                state.loading = false
                state.sosData = action.payload
                state.success = true
            },
        )
        builder.addCase(sosDataGet.rejected, state => {
            state.loading = false
            state.success = false
        })

        //sos alert
        builder.addCase(sosAlertGet.pending, state => {
            state.loading = true
        })
        builder.addCase(
            sosAlertGet.fulfilled,
            (state, action: PayloadAction<any[]>) => {
                state.loading = false
                state.sosAlert = action.payload
                state.success = true
            },
        )
        builder.addCase(sosAlertGet.rejected, state => {
            state.loading = false
            state.success = false
        })
    },
})

export default sosSlice.reducer
