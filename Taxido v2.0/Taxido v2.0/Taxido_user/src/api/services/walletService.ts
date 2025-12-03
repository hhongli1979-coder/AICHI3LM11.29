import {riderWallet, topUpWallet} from '../endpoints/walletEndpoint';
import {GET_API, POST_API} from '../methods';
import {WalletTopUpDatainterface} from '../interface/walletInterface';

export const walletData = async () => {
  return GET_API(riderWallet)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const walletTopUpData = async (data: WalletTopUpDatainterface) => {
  return POST_API(data, topUpWallet)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

const walletServices = {
  walletData,
  walletTopUpData,
};
export default walletServices;
