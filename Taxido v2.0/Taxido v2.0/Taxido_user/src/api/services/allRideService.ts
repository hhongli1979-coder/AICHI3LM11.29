import { ride, payment, invoice, locationChange } from "../endpoints/allRIdeEndpoint";
import { GET_API, POST_API, PUT_API } from "../methods";
import { PaymentInterface } from "../interface/allRideInterface";


export const allRide = async (ride_id: number) => {
  const endpointWithParams = `${ride}/${ride_id}`;
  return GET_API(endpointWithParams)
    .then((res) => {

      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


export const allRides = async () => {
  const endpointWithParams = `${ride}`;
  return GET_API(endpointWithParams)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


export const allpayment = async (data: PaymentInterface) => {
  return POST_API(data, payment)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


export const rideUpdate = async ({ payload, ride_id }: { payload: any; ride_id: number }) => {
  return PUT_API(`${ride}/${ride_id}`, payload)

    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


export const allInvoice = async (ride_number: number) => {
  const endpointWithParams = `${invoice}/${ride_number}`;
  return GET_API(endpointWithParams)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

export const locationChanges = async (data: PaymentInterface) => {
  return POST_API(data, locationChange)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};



const allRideServices = {
  allRide,
  allpayment,
  allRides,
  rideUpdate,
  allInvoice,
  locationChanges
};

export default allRideServices;