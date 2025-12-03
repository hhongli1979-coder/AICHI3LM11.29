import {
  currency,
  address,
  settings,
  language,
  translate,
  taxidoSetting,
} from '../endpoints/settingEndPoint';
import {GET_API} from '../methods';

export const currencyDataGet = async () => {
  return GET_API(currency)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const addressDataGet = async () => {
  return GET_API(address)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const settingDataGet = async () => {
  return GET_API(settings)
    .then(res => {

      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const taxidosettingDataGet = async () => {
  return GET_API(taxidoSetting)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const languageDataGet = async () => {
  return GET_API(language)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const translateDataGet = async () => {
  return GET_API(translate)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

const settingServices = {
  currencyDataGet,
  addressDataGet,
  settingDataGet,
  languageDataGet,
  translateDataGet,
  taxidosettingDataGet,
};

export default settingServices;
