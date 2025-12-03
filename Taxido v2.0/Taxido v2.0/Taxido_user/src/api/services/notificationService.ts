import { notifications } from "../endpoints/notificationEndPoint";
import { GET_API } from "../methods";

export const notificationDataGet = async () => {
  return GET_API(notifications)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const notificationServices = {
  notificationDataGet,
};

export default notificationServices;
