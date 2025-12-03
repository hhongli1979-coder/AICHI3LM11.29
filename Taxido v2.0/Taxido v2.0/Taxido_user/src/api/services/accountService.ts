import { editProfile, userSelf, deleteAccount, country, phoneOrEmail, verifyPhoneOrEmail } from "../endpoints/accountEndPoint";
import { UpdateProfileInterface } from "../interface/accountInterface";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../methods";

export const selfData = async () => {
  return GET_API(userSelf)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const countryData = async () => {
  return GET_API(country)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const updateProfile = async (data: UpdateProfileInterface) => {
  return PUT_API(editProfile, data)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const updateMobileEmail = async (data: UpdateProfileInterface) => {
  return POST_API(data, phoneOrEmail)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const verifyMobileEmail = async (data: UpdateProfileInterface) => {
  return POST_API(data, verifyPhoneOrEmail)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const accountDelete = async () => {
  return DELETE_API(deleteAccount)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

const accountServices = {
  selfData,
  updateProfile,
  accountDelete,
  countryData,
  updateMobileEmail,
  verifyMobileEmail,
};
export default accountServices;
