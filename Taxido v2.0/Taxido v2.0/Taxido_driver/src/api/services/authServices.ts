import {
  login,
  register,
  verifyOtp,
  mailLogin,
  FirebaseAuth,
  fleetLogin,
  fleetRegister,
  fleetVerifyOtp,
} from '../endpoints/authEndPoints'
import {
  DriverLoginInterface,
  DriverRegistrationPayload,
  VerifyOtpInterface,
  UserLoginEmailInterface,
  FirebaseOTPInterface,
  FleetLoginInterface,
  FleetVerifyOtpInterface,
  FleetRegistrationPayload,
} from '../interface/authInterface'
import { GET_API, POST_API } from '../methods'

export const userLogin = async (data: DriverLoginInterface) => {
  return POST_API(data, login)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const fleetsLogin = async (data: FleetLoginInterface) => {
  return POST_API(data, fleetLogin)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const userVerifyOtp = async (data: VerifyOtpInterface) => {
  return POST_API(data, verifyOtp)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const fleetsVerifyOtp = async (data: FleetVerifyOtpInterface) => {
  return POST_API(data, fleetVerifyOtp)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const userRegistration = async (data: DriverRegistrationPayload) => {
  return POST_API(data, register)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const fleetRegistration = async (data: FleetRegistrationPayload) => {
  return POST_API(data, fleetRegister)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const userMailLogin = async (data: UserLoginEmailInterface) => {
  return POST_API(data, mailLogin)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const firebaseOTP = async (data: FirebaseOTPInterface) => {
  return POST_API(data, FirebaseAuth)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

const authServices = {
  userLogin,
  userRegistration,
  userVerifyOtp,
  userMailLogin,
  firebaseOTP,
  fleetsLogin,
  fleetsVerifyOtp,
  fleetRegistration,
}

export default authServices
