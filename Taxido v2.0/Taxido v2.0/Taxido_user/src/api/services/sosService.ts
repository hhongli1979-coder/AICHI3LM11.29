import { sos, sosAlert } from "../endpoints/sosEndpoint";
import { SOSAlertDataInterface } from "../interface/sosInterface";
import { GET_API, POST_API } from "../methods";

export const sosData = async (zone_id: number) => {
  const endpointWithParams = `${sos}?zones=${zone_id}`;
  return GET_API(endpointWithParams)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

export const sosAlertData = async (data: SOSAlertDataInterface) => {
  return POST_API(data, sosAlert)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const sosServices = {
  sosData,
  sosAlertData,
};

export default sosServices;
