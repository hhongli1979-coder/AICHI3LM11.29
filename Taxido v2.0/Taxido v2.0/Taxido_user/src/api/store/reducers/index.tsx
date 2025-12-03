import authReducer from "./authReducer";
import zoneReducer from "./zoneReducer";
import bannerReducer from "./bannerReducer";
import vehicleTypeReducer from "./vehicleTypeReducer";
import settingReducer from './settingReducer';
import categoryReducer from "./categoryReducer";
import rideRequestReducer from "./rideRequestReducer";
import accountReducer from "./accountReducer";
import serviceReducer from "./serviceReducer";
import bidReducer from "./bidReducer";
import allDriverReducer from "./allDriverReducer";
import allRideReducer from "./allRideReducer";
import cancelationReducer from "./cancelationReducer";
import sosReducer from "./sosReducer";
import walletReducer from './walletReducer'
import paymentReducer from './paymentReducer'
import couponReducer from './couponReducer'
import packageRedecer from './packageReducer'
import { combineReducers, createAction } from '@reduxjs/toolkit';
import saveLocationReducer from './saveLocationReducer'
import ticketReducer from './ticketReducer'
import rentalReducer from './rentalReducer'
import reviewReducer from './reviewReducer'
import notificationReducer from './notificationReducer'
import homescreenReducer from './homeScreenReducer'
import ambulanceReducer from './ambulanceReducer'
import referralReducer from './referralReducer'

export const resetState = createAction('RESET_STATE');

const appReducer = combineReducers({
  auth: authReducer,
  zone: zoneReducer,
  banner: bannerReducer,
  vehicleType: vehicleTypeReducer,
  setting: settingReducer,
  serviceCategory: categoryReducer,
  rideRequest: rideRequestReducer,
  account: accountReducer,
  service: serviceReducer,
  bid: bidReducer,
  allDriver: allDriverReducer,
  allRide: allRideReducer,
  cancelationReason: cancelationReducer,
  sos: sosReducer,
  wallet: walletReducer,
  payment: paymentReducer,
  coupon: couponReducer,
  package: packageRedecer,
  saveLocation: saveLocationReducer,
  tickets: ticketReducer,
  rentalVehicle: rentalReducer,
  reviewReducer: reviewReducer,
  notification: notificationReducer,
  home: homescreenReducer,
  ambulance: ambulanceReducer,
  refer: referralReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === resetState.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer