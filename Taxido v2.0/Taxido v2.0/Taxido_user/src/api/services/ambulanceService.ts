import { ambulance, ambulanceRequest } from "../endpoints/ambulanceEndpoit";
import { GET_API, POST_API } from "../methods";
import {
  AmbulanceInterface,
  ambulanceRequestInterface,
} from "../interface/ambulanceInterface";

export const ambulanceList = async (lat: number, lng: number) => {
  const endpointWithParams = `${ambulance}?lat=${lat}&lng=${lng}`;
  return GET_API(endpointWithParams)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

export const ambulancebook = async (data: ambulanceRequestInterface) => {
  return POST_API(data, ambulanceRequest)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const ambulanceServices = {
  ambulanceList,
  ambulancebook,
};

export default ambulanceServices;
