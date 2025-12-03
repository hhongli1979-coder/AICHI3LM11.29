import { driver } from "../endpoints/allDriversEndPoint";
import { GET_API } from "../methods";

export const allDriver = async (zones: number, is_online: number,is_on_ride:number) => {
  const endpointWithParams = `${driver}?zones=${zones}&is_online=${is_online}&is_on_ride=${is_on_ride}`;
    return GET_API(endpointWithParams )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return e?.response;
      });
  };
  

  const allDriverServices = {
    allDriver,
  };
  
  export default allDriverServices;