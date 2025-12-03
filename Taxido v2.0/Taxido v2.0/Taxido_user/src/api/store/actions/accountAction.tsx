import { UPDATEPROFILE, SELF, DELETEACCOUNT, COUNTRY, UPDATEMOBILEMAIL, VERIFYMOBILEMAIL } from "../types/index";
import { accountServices } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateProfileInterface } from "@src/api/interface/accountInterface";


export const selfData = createAsyncThunk(SELF, async () => {
  const response = await accountServices.selfData();
  if (response.status == 200) {
    return response;
  } else {
    return 'Error';
  }
});

export const countryData = createAsyncThunk(COUNTRY, async () => {
  const response = await accountServices.countryData();
  return response;
});


export const updateProfile = createAsyncThunk(UPDATEPROFILE, async (data: UpdateProfileInterface) => {
  const response = await accountServices.updateProfile(data.data);
  if (response.status == 200) {
    data.dispatch(selfData());
    return response?.data;
  } else {
    return 'Error';
  }
});

export const updateMobileEmail = createAsyncThunk(UPDATEMOBILEMAIL, async (data: UpdateProfileInterface) => {
  const response = await accountServices.updateMobileEmail(data);
  return response;
});

export const verifyMobileEmail = createAsyncThunk(VERIFYMOBILEMAIL, async (data: UpdateProfileInterface) => {
  const response = await accountServices.verifyMobileEmail(data);
  return response;
});

export const accountDelete = createAsyncThunk(DELETEACCOUNT, async () => {
  const response = await accountServices.accountDelete();
  if (response.status == 200) {
    return response?.data;
  } else {
    return 'Error';
  }
});