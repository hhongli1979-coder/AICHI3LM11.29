import {
  USER_LOGIN,
  USER_REGISTRATION,
  VERIFY_OTP,
  SELF,
  USER_LOGIN_MAIL,
  SOCIAL_LOGIN,
  FIREBASE_OTP,
} from "../types/index";
import {
  UserLoginInterface,
  UserRegistrationPayload,
  VerifyOtpInterface,
  UserLoginEmailInterface,
  SocialLoginInterface,
  FirebaseOTPInterface,
} from "../../interface/authInterface";
import { authServices } from "../../services/index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userLogin = createAsyncThunk(
  USER_LOGIN,
  async (data: UserLoginInterface) => {
    const response = await authServices.userLogin(data);
    return response?.data;
  }
);


export const socialLogin = createAsyncThunk(
  SOCIAL_LOGIN,
  async (data: SocialLoginInterface) => {
    const response = await authServices.socialLogin(data);
    return response?.data;
  }
);

export const userVerifyOtp = createAsyncThunk(
  VERIFY_OTP,
  async (data: VerifyOtpInterface) => {
    const response = await authServices.userVerifyOtp(data);
    return response?.data;
  }
);

export const userRegistration = createAsyncThunk(
  USER_REGISTRATION,
  async (data: UserRegistrationPayload) => {
    const response = await authServices.userRegistration(data);
    if (response.status == 200) {
      return response?.data;
    } else {
      return response.data;
    }
  }
);

export const self = createAsyncThunk(SELF, async () => {
  const response = await authServices.self();
  if (response.status == 200) {
    return response?.data;
  } else {
    return response.data;
  }
});

export const userMailLogin = createAsyncThunk(
  USER_LOGIN_MAIL,
  async (data: UserLoginEmailInterface) => {
    const response = await authServices.userMailLogin(data);
    return response?.data;
  }
);

export const firebaseOTPLogin = createAsyncThunk(
  FIREBASE_OTP,
  async (data: FirebaseOTPInterface) => {
    const response = await authServices.firebaseOTP(data);
    return response?.data;
  }
);



export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await AsyncStorage.removeItem("phone");
  return true;
});

