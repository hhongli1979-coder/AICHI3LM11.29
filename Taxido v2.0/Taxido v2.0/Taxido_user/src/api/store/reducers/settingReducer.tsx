import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  currencyDataGet,
  settingDataGet,
  languageDataGet,
  translateDataGet,
  taxidosettingDataGet
} from "../actions/settingAction";
import { CurrencyInterface } from "../../interface/settingInterface";

const initialState: CurrencyInterface | any = {
  currencyData: [],
  settingData: [],
  serverStatus: null,
  taxidoSettingData: [],
  languageData: [],
  translateData: [],
  loading: false,
  success: false,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(currencyDataGet.pending, (state: any) => {
        state.loading = true;
      })

      .addCase(
        currencyDataGet.fulfilled,
        (state: any, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.currencyData = action.payload;
          state.success = true;
        }
      )
      .addCase(currencyDataGet.rejected, (state: any) => {
        state.loading = false;
        state.success = false;
      })



      .addCase(settingDataGet.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(
        settingDataGet.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.loading = false;
          state.settingData = action.payload.data;
          state.serverStatus = action.payload.response.status;
          state.success = true;
        }
      )
      .addCase(settingDataGet.rejected, (state: any) => {
        state.loading = false;
        state.success = false;
      })




      .addCase(taxidosettingDataGet.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(
        taxidosettingDataGet.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.loading = false;
          state.taxidoSettingData = action.payload;
          state.success = true;
        }
      )
      .addCase(taxidosettingDataGet.rejected, (state: any) => {
        state.loading = false;
        state.success = false;
      })



      .addCase(languageDataGet.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(
        languageDataGet.fulfilled,
        (state: any, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.languageData = action.payload;
          state.success = true;
        }
      )
      .addCase(languageDataGet.rejected, (state: any) => {
        state.loading = false;
        state.success = false;
      })

      .addCase(translateDataGet.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(
        translateDataGet.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.loading = false;
          state.translateData = action.payload;
          state.success = true;
        }
      )
      .addCase(translateDataGet.rejected, (state: any) => {
        state.loading = false;
        state.success = false;
      });
  },
});

export default settingSlice.reducer;
