import {coupons, couponsVerify} from '../endpoints/couponeEndPoint';
import {CouponsVerifyInterface} from '../interface/couponInterface';
import {GET_API, POST_API} from '../methods';

export const couponListData = async () => {
  return GET_API(coupons)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const couponVerifyData = async (data: CouponsVerifyInterface) => {
  return POST_API(data, couponsVerify)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

const couponService = {
  couponListData,
  couponVerifyData,
};

export default couponService;
