import { zone } from "../endpoints/zoneEndPoint";
import { ZoneInterface } from "../interface/zoneInterface";
import { GET_API } from "../methods";

export const userZone = async (lat: number, lng: number) => {
  const endpointWithParams = `${zone}?lat=${lat}&lng=${lng}`;
    return GET_API(endpointWithParams )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return e?.response;
      });
  };
  

  const zoneServices = {
    userZone,
  };
  
  export default zoneServices;