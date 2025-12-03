import {
  payment,
  verify_payment
} from "../endpoints/paymentEndpoint";
import { PaymentVerifyInterface } from "../interface/paymentInterface";
import { GET_API, POST_API } from "../methods";

export const paymentData = async () => {
  return GET_API(payment)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


export const paymentVerify = async (data: PaymentVerifyInterface) => {
  return POST_API(data, verify_payment)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


const paymentServices = {
  paymentData,
  paymentVerify
};
export default paymentServices;
