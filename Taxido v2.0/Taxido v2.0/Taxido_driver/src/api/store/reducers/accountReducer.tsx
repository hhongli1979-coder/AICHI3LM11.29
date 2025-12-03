import { createSlice } from '@reduxjs/toolkit'
import {
  updateProfile,
  deleteProfile,
  selfDriverData,
  selfFleetData,
  updateBankDetails,
  updateDocument,
  updateVehicle,
  countryData,
  preferenceData,
  updateMobileEmail,
  verifyMobileEmail
} from '../action/accountAction'

const initialState = {
  loading: false,
  selfDriver: null,
  BankDetailUpdate: [],
  VehicleRegisUpdate: [],
  documentUpdate: [],
  defaultAddress: null,
  accountDetails: null,
  countryList: [],
  preferenceList: [],
  updateMobileEmailData: [],
  verifyMobileEmailData: [],
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateDefaultAdd(state, action) {
      state.defaultAddress = action.payload
    },
    financialState(state, action) {
      state.val = action.payload
    },
    updateLoading(state, action) {
      state.loading = action.payload
    },
  },
  extraReducers: builder => {
    //Self Driver Cases
    builder.addCase(selfDriverData.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(selfDriverData.fulfilled, (state, action) => {
      state.selfDriver = action.payload
      state.selfDriver = action.payload
      state.loading = false
    })
    builder.addCase(selfDriverData.rejected, (state, action) => {
      state.loading = false
    })

    //fleet Driver Cases
    builder.addCase(selfFleetData.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(selfFleetData.fulfilled, (state, action) => {
      state.selfDriver = action.payload
      state.selfDriver = action.payload
      state.loading = false
    })
    builder.addCase(selfFleetData.rejected, (state, action) => {
      state.loading = false
    })

    //UpdateProfile Cases
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => { })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false
    })

    //DeleteProfile Cases
    builder.addCase(deleteProfile.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(deleteProfile.fulfilled, (state, action) => { })
    builder.addCase(deleteProfile.rejected, (state, action) => {
      state.loading = false
    })

    //update bankDetails
    builder.addCase(updateBankDetails.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(updateBankDetails.fulfilled, (state, action) => {
      state.BankDetailUpdate = action.payload
      state.loading = false
    })
    builder.addCase(updateBankDetails.rejected, state => {
      state.loading = false
    })

    //update vehicleRegi
    builder.addCase(updateVehicle.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(updateVehicle.fulfilled, (state, action) => {
      state.VehicleRegisUpdate = action.payload
      state.loading = false
    })
    builder.addCase(updateVehicle.rejected, state => {
      state.loading = false
    })

    //update bankDetails
    builder.addCase(updateDocument.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(updateDocument.fulfilled, (state, action) => {
      state.documentUpdate = action.payload
      state.loading = false
    })
    builder.addCase(updateDocument.rejected, state => {
      state.loading = false
    })

    //country data
    builder.addCase(countryData.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(countryData.fulfilled, (state, action) => {
      state.countryList = action.payload
      state.loading = false
    })
    builder.addCase(countryData.rejected, (state, action) => {
      state.loading = false
    })

    //pref data
    builder.addCase(preferenceData.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(preferenceData.fulfilled, (state, action) => {
      state.preferenceList = action.payload
      state.loading = false
    })
    builder.addCase(preferenceData.rejected, (state, action) => {
      state.loading = false
    })
    //mobile or email update
    builder.addCase(updateMobileEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateMobileEmail.fulfilled, (state, action) => {
      state.updateMobileEmailData = action.payload;
    });
    builder.addCase(updateMobileEmail.rejected, (state, action) => {
      state.loading = false;
    });

    //Verify mobile or email update
    builder.addCase(verifyMobileEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(verifyMobileEmail.fulfilled, (state, action) => {
      state.verifyMobileEmailData = action.payload;
    });
    builder.addCase(verifyMobileEmail.rejected, (state, action) => {
      state.loading = false;
    });

  },
})

export const { updateDefaultAdd, financialState, updateLoading } =
  accountSlice.actions
export default accountSlice.reducer
