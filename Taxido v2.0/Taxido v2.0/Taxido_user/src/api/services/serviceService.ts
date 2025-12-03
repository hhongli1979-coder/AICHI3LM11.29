import { service } from "../endpoints/serviceEndPoint";
import { GET_API } from "../methods";

export const serviceDataGet = async () => {
  return GET_API(service)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const serviceServices = {
    serviceDataGet,
};

export default serviceServices;
