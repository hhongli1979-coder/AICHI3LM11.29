import { category } from "../endpoints/categoryEndPoint";
import { GET_API } from "../methods";

export const categoryDataGet = async () => {
  return GET_API(category)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const categoryServices = {
    categoryDataGet: categoryDataGet,
};

export default categoryServices;
