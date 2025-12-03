import {location} from "../endpoints/saveLocationEndPoint";
import {SaveLocationDataInterface} from "../interface/saveLocationinterface";
import {POST_API, PUT_API, DELETE_API, GET_API} from "../methods";

export const addSaveLocation = async (data: SaveLocationDataInterface) => {
  return POST_API(data, location)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const userSaveLocation = async () => {
  return GET_API(location)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const updateSaveLocation = async ({
  data,
  locationID,
}: {
  data: SaveLocationDataInterface;
  locationID: number;
}) => {
  return PUT_API(`location/${locationID}`, data)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

export const deleteSaveLocation = async (addressID: number) => {
  return DELETE_API(`location/${addressID}`)
    .then(res => {
      return res;
    })
    .catch(e => {
      return e?.response;
    });
};

const saveLocationService = {
  addSaveLocation,
  userSaveLocation,
  updateSaveLocation,
  deleteSaveLocation,
};

export default saveLocationService;
