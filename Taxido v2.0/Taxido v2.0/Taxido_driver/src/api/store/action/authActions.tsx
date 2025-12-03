import {
  USER_LOGIN,
  USER_REGISTRATION,
  VERIFY_OTP,
  USER_LOGIN_MAIL,
  FIREBASE_OTP,
  FLEET_LOGIN,
  FLEET_REGISTRATION,
  FLEET_VERIFY_OTP
} from '../types/index'
import {
  DriverLoginInterface,
  DriverRegistrationPayload,
  VerifyOtpInterface,
  UserLoginEmailInterface,
  FirebaseOTPInterface,
  FleetLoginInterface,
  FleetRegistrationPayload,
  FleetVerifyOtpInterface
} from '../../interface/authInterface'
import { authServices } from '../../services/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const userLogin = createAsyncThunk(
  USER_LOGIN,
  async (data: DriverLoginInterface) => {
    const response = await authServices.userLogin(data)
    return response?.data
  },
)

export const fleetsLogin = createAsyncThunk(
  FLEET_LOGIN,
  async (data: FleetLoginInterface) => {
    const response = await authServices.fleetsLogin(data)
    return response?.data
  },
)

export const userVerifyOtp = createAsyncThunk(
  VERIFY_OTP,
  async (data: VerifyOtpInterface) => {
    const response = await authServices.userVerifyOtp(data)
    return response?.data
  },
)

export const fleetsVerifyOtp = createAsyncThunk(
  FLEET_VERIFY_OTP,
  async (data: FleetVerifyOtpInterface) => {
    const response = await authServices.fleetsVerifyOtp(data)
    return response?.data
  },
)

export const userRegistration = createAsyncThunk(
  USER_REGISTRATION,
  async (data: DriverRegistrationPayload) => {
    const response = await authServices.userRegistration(data)
    if (response.status == 200) {
      return response?.data
    } else {
      return response.data
    }
  },
)

export const fleetRegistration = createAsyncThunk(
  FLEET_REGISTRATION,
  async (data: FleetRegistrationPayload) => {
    const response = await authServices.fleetRegistration(data)
    if (response.status == 200) {
      return response?.data
    } else {
      return response.data
    }
  },
)

export const userMailLogin = createAsyncThunk(
  USER_LOGIN_MAIL,
  async (data: UserLoginEmailInterface) => {
    const response = await authServices.userMailLogin(data)
    return response?.data
  },
)


export const firebaseOTPLogin = createAsyncThunk(
  FIREBASE_OTP,
  async (data: FirebaseOTPInterface) => {
    const response = await authServices.firebaseOTP(data);
    return response?.data;
  }
);
