import authReducer from './authReducer'
import accountReducer from './accountReducer'
import serviceReducer from './serviceReducer'
import categoryReducer from './categoryReducer'
import vehicleTypeReducer from './vehicleTypeReducer'
import driverRuleReducer from './driverRuleReducer'
import documentReducer from './documentReducer'
import zoneReducer from './zoneReducer'
import rideRequestReducer from './rideRequestReducer'
import bidReducer from './bidReducer'
import rideReducer from './rideReducer'
import reviewReducer from './reviewReducer'
import walletReducer from './walletReducer'
import { combineReducers, createAction } from '@reduxjs/toolkit'
import ticketReducer from './ticketReducer'
import settingReducer from './settingReducer'
import rentalVehiclereducer from './rentalReducer'
import notificationReducer from './notificationReducer'
import sosReducer from './sosReducer'
import dashBoardReducer from './dashBoardReducer'
import cancelationReducer from "./cancelationReducer";
import fleetReducer from './fleetReducer'
import referralReducer from './referralReducer'
import incentiveReducer from './incentiveReducer'

export const resetState = createAction('RESET_STATE')

const appReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
  service: serviceReducer,
  serviceCategory: categoryReducer,
  vehicleType: vehicleTypeReducer,
  driverRule: driverRuleReducer,
  documents: documentReducer,
  zoneUpdate: zoneReducer,
  rideRequest: rideRequestReducer,
  bid: bidReducer,
  ride: rideReducer,
  reviewPost: reviewReducer,
  wallet: walletReducer,
  tickets: ticketReducer,
  setting: settingReducer,
  rental: rentalVehiclereducer,
  notification: notificationReducer,
  sos: sosReducer,
  dashboard: dashBoardReducer,
  cancelationReason: cancelationReducer,
  fleet: fleetReducer,
  refer: referralReducer,
  incentives: incentiveReducer
})

const rootReducer = (state, action) => {
  if (action.type === resetState.type) {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer
