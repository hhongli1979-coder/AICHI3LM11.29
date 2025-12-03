import {
  SAVELOCATION,
  EDITSAVELOCATION,
  DELETESAVELOCATION,
  GETSAVELOCATION,
} from "../types/index";
import { SaveLocationDataInterface } from "../../interface/saveLocationinterface";
import { saveLocationService } from "../../services/index";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addSaveLocation = createAsyncThunk(
  SAVELOCATION,
  async (data: SaveLocationDataInterface) => {
    const response = await saveLocationService.addSaveLocation(data);
    return response?.data;
  }
);

export const deleteSaveLocation = createAsyncThunk(
  DELETESAVELOCATION,
  async (addressID: number) => {
    const response = await saveLocationService.deleteSaveLocation(addressID);
    return {
      data: response.data,
      status: response.status,
    }
  }
);

export const updateSaveLocation = createAsyncThunk(
  EDITSAVELOCATION,
  async ({ data, locationID }: { data: any; locationID: number }) => {
    const response = await saveLocationService.updateSaveLocation({
      data,
      locationID,
    });
    return response?.data;
  }
);

export const userSaveLocation = createAsyncThunk(GETSAVELOCATION, async () => {
  const response = await saveLocationService.userSaveLocation();
  return response?.data;
});
