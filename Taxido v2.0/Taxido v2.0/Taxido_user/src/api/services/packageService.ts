import { hourlyPackage } from '../endpoints/packageEndPoint';
import { GET_API } from '../methods';

export const packageDataGet = async (zone_id: number) => {
  return GET_API(`${hourlyPackage}?zone_id=${zone_id}`)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

const packageServices = {
  packageDataGet,
};

export default packageServices;
