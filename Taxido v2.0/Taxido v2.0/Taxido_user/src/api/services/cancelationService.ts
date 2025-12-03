import {
   cancellationReason
  } from "../endpoints/cancelationEndPoint";
  import { GET_API } from "../methods";
  
  export const cancelationData = async () => {
    return GET_API(cancellationReason)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return e?.response;
      });
  };
  

  const cancelationServices = {
    cancelationData
  };
  
  export default cancelationServices;
  