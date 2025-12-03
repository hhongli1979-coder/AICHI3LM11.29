import {
  login,
  register,
  verifyOtp,
  userSelf,
  mailLogin,
  SocialLogin,
  FirebaseAuth,
} from '../endpoints/authEndPoints';
import {
  UserLoginInterface,
  UserRegistrationPayload,
  VerifyOtpInterface,
  UserLoginEmailInterface,
  SocialLoginInterface,
  FirebaseOTPInterface,
} from '../interface/authInterface';
import {GET_API, POST_API} from '../methods';

export const userLogin = async (data: UserLoginInterface) => {
  return POST_API(data, login)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const socialLogin = async (data: SocialLoginInterface) => {
  return POST_API(data, SocialLogin)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const userVerifyOtp = async (data: VerifyOtpInterface) => {
  return POST_API(data, verifyOtp)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const userRegistration = async (data: UserRegistrationPayload) => {
  return POST_API(data, register)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const self = async () => {
  return GET_API(userSelf)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const userMailLogin = async (data: UserLoginEmailInterface) => {
  return POST_API(data, mailLogin)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const firebaseOTP = async (data: FirebaseOTPInterface) => {
  return POST_API(data, FirebaseAuth)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

const authServices = {
  userLogin,
  socialLogin,
  userRegistration,
  userVerifyOtp,
  self,
  userMailLogin,
  firebaseOTP,
};

export default authServices;
