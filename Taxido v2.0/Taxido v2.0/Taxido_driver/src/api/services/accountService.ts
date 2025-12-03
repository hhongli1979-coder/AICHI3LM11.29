import { editProfile, deleteAccount, driverSelf, editBank, documentUpdate, updateVehicleRegi, fleetSelf, country, preference, phoneOrEmail, verifyPhoneOrEmail } from '../endpoints/accountEndPoint'
import { BankDetailsinterface, UpdateProfileInterface, updateVehicleInterface } from '../interface/accountInterface'
import { GET_API, PUT_API, DELETE_API, POST_API } from '../methods'

export const selfDriverData = async () => {
  return GET_API(driverSelf)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const selfFleetData = async () => {
  return GET_API(fleetSelf)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const updateProfile = async data => {
  return PUT_API(editProfile, data)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const deleteProfile = async () => {
  return DELETE_API(deleteAccount)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const updateBankDetails = async (data: BankDetailsinterface) => {
  return POST_API(data, editBank)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const updateDocument = async (data: BankDetailsinterface) => {
  return POST_API(data, documentUpdate)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const updateVehicleRegis = async (data: updateVehicleInterface) => {
  return POST_API(data, updateVehicleRegi)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const countryData = async () => {
  return GET_API(country)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

export const preferenceData = async () => {
  return GET_API(preference)
    .then(res => {
      return res
    })
    .catch(e => {
      return e?.response
    })
}

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

const accountServices = {
  selfDriverData,
  selfFleetData,
  updateProfile,
  deleteProfile,
  updateBankDetails,
  updateDocument,
  updateVehicleRegis,
  countryData,
  preferenceData,
  updateMobileEmail,
  verifyMobileEmail

}
export default accountServices
