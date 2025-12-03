import { bid } from "../endpoints/bidEndPoint";
import { GET_API, PUT_API } from "../methods";

export const bidDataGet = async ({ ride_request_id }: { ride_request_id: number }) => {
  return GET_API(`${bid}?ride_request_id=${ride_request_id}`)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


export const bidUpdate = async ({ payload, bid_id }: { payload: any; bid_id: number }) => {
  return PUT_API(`${bid}/${bid_id}`, payload) 
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const bidServices = {
  bidDataGet,
  bidUpdate,
};

export default bidServices;
