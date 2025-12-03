import { driverReview } from "../endpoints/reviewEndpoint";
import { DriverReviewDataInterface } from "../interface/reviewInterface";
import { POST_API, GET_API } from "../methods";

export const driverReviewPost = async (data: DriverReviewDataInterface) => {
  return POST_API(data, driverReview)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};



const driverReviewServices = {
  driverReviewPost,

};

export default driverReviewServices;