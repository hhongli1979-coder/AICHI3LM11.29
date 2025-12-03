import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addSaveLocation,
  deleteSaveLocation,
  updateSaveLocation,
  userSaveLocation,
} from "../actions/saveLocationAction";
import { SaveLocationInterface } from "../../interface/saveLocationinterface";

const initialState: SaveLocationInterface = {
  saveLocationData: [],
  saveLocationDataUpdate: [],
  saveLocationDataGet: [],
  loading: false,
  success: false,
  statusCode: null,
};

const saveLocationSlice = createSlice({
  name: "saveLocation",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    //add location
    builder.addCase(addSaveLocation.pending, (state: any) => {
      state.loading = true;
    });

    builder.addCase(
      addSaveLocation.fulfilled,
      (state: any, action: PayloadAction<{ data: any; status: number }>) => {
        state.loading = false;
        state.saveLocationData = action.payload.data;
        state.statusCode = action.payload.status;
        state.success = true;
      }
    );
    builder.addCase(addSaveLocation.rejected, (state: any, action: any) => {
      state.loading = false;
      state.success = false;
      state.statusCode = action.payload?.status || 500;
    });

    //delete location
    builder.addCase(deleteSaveLocation.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(
      deleteSaveLocation.fulfilled,
      (state: any, action: PayloadAction<any[]>) => { }
    );
    builder.addCase(deleteSaveLocation.rejected, (state: any) => {
      state.loading = false;
      state.success = false;
    });

    //edit location
    builder.addCase(updateSaveLocation.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(
      updateSaveLocation.fulfilled,
      (state: any, action: PayloadAction<any[]>) => { }
    );
    builder.addCase(updateSaveLocation.rejected, (state: any) => {
      state.loading = false;
      state.success = false;
    });

    //get location
    builder.addCase(userSaveLocation.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(
      userSaveLocation.fulfilled,
      (state: any, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.saveLocationDataGet = action.payload;
        state.success = true;
      }
    );
    builder.addCase(userSaveLocation.rejected, (state: any) => {
      state.loading = false;
      state.success = false;
    });
  },
});

export default saveLocationSlice.reducer;
