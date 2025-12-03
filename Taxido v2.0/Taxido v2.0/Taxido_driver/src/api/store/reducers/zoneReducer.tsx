import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { driverZone, rentalZone, currentZone } from '../action/zoneAction'
import { ZoneUpdatePayload } from '../../interface/zoneInterface'

const initialState: ZoneUpdatePayload = {
  locations: [],
  rentalZones: [],
  zoneValue: [],
  loading: false,
  success: false,
};

const zoneSlice = createSlice({
  name: "zoneUpdate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(driverZone.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(driverZone.fulfilled, (state, action) => {
      state.locations = action.payload;
      state.loading = false;
    });
    builder.addCase(driverZone.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });

    builder.addCase(rentalZone.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      rentalZone.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.rentalZones = action.payload
        state.loading = false
      },
    )
    builder.addCase(rentalZone.rejected, state => {
      state.loading = false
      state.success = false
    })


    builder.addCase(currentZone.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(currentZone.fulfilled, (state, action) => {
      state.zoneValue = action.payload;
      state.loading = false;
    });

  },
});

export default zoneSlice.reducer;

