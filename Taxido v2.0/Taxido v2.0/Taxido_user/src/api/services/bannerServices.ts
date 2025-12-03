import { banners } from "../endpoints/bannerEndPoint";
import { GET_API } from "../methods";

export const bannerDataGet = async () => {
  return GET_API(banners)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const bannerServices = {
  bannerDataGet,
};

export default bannerServices;
