import { homeScreen } from "../endpoints/homeScreenEndPoint";
import { GET_API } from "../methods";

export const homeScreenData = async ({ service }: { service: string }) => {
  return GET_API(`${homeScreen}?service=${service}`)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

export const homeScreenPrimary = async () => {
  return GET_API(homeScreen)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

const homeScreenService = {
  homeScreenData,
  homeScreenPrimary,
};

export default homeScreenService;
