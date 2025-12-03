import React, { useEffect, useState } from 'react'
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native'
import { RootStack } from './main/RootStackNavigator'
import TabNav from './tabNavigator'
import { Splash } from '../screen/intro/splash'
import { OnBoarding } from '../screen/intro/onBoarding'
import { Otp } from '../screen/auth/otp'
import { LoginMail } from '../screen/auth/loginMail'
import { CreateAccount } from '../screen/auth/registration/createAccount'
import { DocumentVerify } from '../screen/auth/registration/documentVerify'
import { VehicleRegistration } from '../screen/auth/registration/vehicleRegistration'
import { BankDetail } from '../screen/auth/registration/bankDetails'
import { AddDocument, AddVehicleDetails, Incentive, IncentiveTask, ManageVehicle, ReferralHome, ReferralList, Settings, TopUp } from '../screen/settings'
import { AppSettings } from '../screen/settings/appSettings'
import { MyWallet } from '../screen/settings/myWallet'
import { TopupWallet } from '../screen/settings/topupWallet'
import { Chat } from '../screen/settings/chat'
import { AddNewOffer } from '../screen/settings/addNewOffer'
import { ProfileSetting } from '../screen/settings/profileSetting'
import { MyRide } from '../screen/myRide'
import { AcceptFare } from '../screen/home/acceptFare'
import { ActiveRide } from '../screen/home/activeRide'
import { EndRide } from '../screen/home/endRide'
import { OtpRide } from '../screen/home/otpRide'
import { Ride } from '../screen/home/ride'
import { RideComplete } from '../screen/home/rideComplete'
import { RideDetails } from '../screen/home/rideDetails'
import { PendingDetails } from '../screen/myRide/pendingDetails'
import { CompleteDetails } from '../screen/myRide/completeDetails'
import { RentalDetails } from '../screen/myRide/rentalDetails'
import { DocumentDetail } from '../screen/settings/documentDetail'
import { BankDetails } from '../screen/settings/bankDetails'
import { VehicleDetail } from '../screen/settings/vehicleDetail'
import { Notification } from '../screen/notification'
import { Subscription } from '../screen/settings/subscription'
import { MapDetails } from '../screen/settings/mapDetails'
import { AddVehicle } from '../screen/settings/addVehicle'
import { useValues } from '../utils/context'
import { Map } from '../screen/mapView'
import { VehicleList } from '../screen/settings/vehicleList'
import { OtpVerify } from '../screen/auth/loginMail/otpverify'
import { SupportTicket } from '../screen/settings/ticket/supportTicket'
import { CreateTicket } from '../screen/settings/ticket/createTicket'
import { TicketDetails } from '../screen/settings/ticket/ticketDetails'
import { PaymentSelect } from '../screen/settings/paymentSelect'
import { PaymentWebView } from '../screen/settings/paymentWebView'
import { RideInfo } from '../screen/myRide'
import { NoService } from '../screen/noService'
import appColors from '../theme/appColors'
import { NoInternet } from '../commonComponents/noInternet'
import NetInfo from '@react-native-community/netinfo'
import { Verification } from '../screen/verification'
import { AmbulanceTrack } from '../screen/home/ambulance/ambulanceTrack'
import DriverList from '../screen/settings/driverLists'
import { navigationRef } from '../commonComponents/helper/navigationService'
import { FleetDetails, UploadedDocument } from '../screen'
import { TotalEarnings } from '../screen/fleet'
import { MapWebView } from '../commonComponents'
import { DashBoard } from '../screen/dashBoard'
import { PdfViewer } from '../screen/myRide'
import { Login } from '../screen'
import { NoInternalServer } from '../screen/noInternalServer'
import { AddDriverDetails, AddDriverDocument } from '../screen/settings/addDriver'
import { FleetDriverDashBoard } from '../screen'
import { EditDetails } from '../screen/settings/editDetails'
import { CompanyDetails } from '../screen/settings/fleetDetails'

function Navigation() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true)

  useEffect(() => {
    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })
  }, [])
  const { isDark } = useValues()

  const DarkThemeValue = {
    ...DarkTheme,
    colors: {
      background: appColors.primaryFont,
      card: appColors.darkThemeSub,
      text: appColors.invoiceBtn,
      border: appColors.darkborder,
    },
  }

  const LightThemeValue = {
    ...DefaultTheme,
    colors: {
      background: appColors.graybackground,
      card: appColors.white,
      text: appColors.primaryFont,
      border: appColors.border,
    },
  }

  const theme: any = isDark ? DarkThemeValue : LightThemeValue

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {!isConnected ? (
          <RootStack.Screen name="NoInternet" component={NoInternet} />
        ) : (
          <>
            <RootStack.Screen name="Splash" component={Splash} />
            <RootStack.Screen name="OnBoarding" component={OnBoarding} />
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen name="LoginMail" component={LoginMail} />
            <RootStack.Screen name="Otp" component={Otp} />
            <RootStack.Screen name="CreateAccount" component={CreateAccount} />
            <RootStack.Screen name="UploadedDocument" component={UploadedDocument} />
            <RootStack.Screen name="DocumentVerify" component={DocumentVerify} />
            <RootStack.Screen name="VehicleRegistration" component={VehicleRegistration} />
            <RootStack.Screen name="FleetDetails" component={FleetDetails} />
            <RootStack.Screen name="BankDetail" component={BankDetail} />
            <RootStack.Screen name="TabNav" component={TabNav} />
            <RootStack.Screen name="Settings" component={Settings} />
            <RootStack.Screen name="AppSettings" component={AppSettings} />
            <RootStack.Screen name="MyWallet" component={MyWallet} />
            <RootStack.Screen name="TopupWallet" component={TopupWallet} />
            <RootStack.Screen name="Chat" component={Chat} />
            <RootStack.Screen name="AddNewOffer" component={AddNewOffer} />
            <RootStack.Screen name="ProfileSetting" component={ProfileSetting} />
            <RootStack.Screen name="MyRide" component={MyRide} />
            <RootStack.Screen name="AcceptFare" component={AcceptFare} />
            <RootStack.Screen name="ActiveRide" component={ActiveRide} />
            <RootStack.Screen name="EndRide" component={EndRide} />
            <RootStack.Screen name="OtpRide" component={OtpRide} />
            <RootStack.Screen name="Ride" component={Ride} />
            <RootStack.Screen name="RideComplete" component={RideComplete} />
            <RootStack.Screen name="RideDetails" component={RideDetails} />
            <RootStack.Screen name="PendingDetails" component={PendingDetails} />
            <RootStack.Screen name="CompleteDetails" component={CompleteDetails} />
            <RootStack.Screen name="RentalDetails" component={RentalDetails} />
            <RootStack.Screen name="DocumentDetail" component={DocumentDetail} />
            <RootStack.Screen name="BankDetails" component={BankDetails} />
            <RootStack.Screen name="VehicleDetail" component={VehicleDetail} />
            <RootStack.Screen name="Notification" component={Notification} />
            <RootStack.Screen name="Subscription" component={Subscription} />
            <RootStack.Screen name="Map" component={Map} />
            <RootStack.Screen name="MapDetails" component={MapDetails} />
            <RootStack.Screen name="AddVehicle" component={AddVehicle} />
            <RootStack.Screen name="VehicleList" component={VehicleList} />
            <RootStack.Screen name="OtpVerify" component={OtpVerify} />
            <RootStack.Screen name="SupportTicket" component={SupportTicket} />
            <RootStack.Screen name="CreateTicket" component={CreateTicket} />
            <RootStack.Screen name="TicketDetails" component={TicketDetails} />
            <RootStack.Screen name="PaymentSelect" component={PaymentSelect} />
            <RootStack.Screen name="PaymentWebView" component={PaymentWebView} />
            <RootStack.Screen name="RideInfo" component={RideInfo} />
            <RootStack.Screen name="NoService" component={NoService} />
            <RootStack.Screen name="Verification" component={Verification} />
            <RootStack.Screen name="AmbulanceTrack" component={AmbulanceTrack} />
            <RootStack.Screen name="DriverList" component={DriverList} />
            <RootStack.Screen name="ManageVehicle" component={ManageVehicle} />
            <RootStack.Screen name="TopUp" component={TopUp} />
            <RootStack.Screen name="TotalEarnings" component={TotalEarnings} />
            <RootStack.Screen name="DashBoard" component={DashBoard} />
            <RootStack.Screen name="MapWebView" component={MapWebView} />
            <RootStack.Screen name="PdfViewer" component={PdfViewer} />
            <RootStack.Screen name="AddVehicleDetails" component={AddVehicleDetails} />
            <RootStack.Screen name="AddDocument" component={AddDocument} />
            <RootStack.Screen name="NoInternalServer" component={NoInternalServer} />
            <RootStack.Screen name="AddDriverDocument" component={AddDriverDocument} />
            <RootStack.Screen name="AddDriverDetails" component={AddDriverDetails} />
            <RootStack.Screen name="FleetDriverDashBoard" component={FleetDriverDashBoard} />
            <RootStack.Screen name="ReferralHome" component={ReferralHome} />
            <RootStack.Screen name="ReferralList" component={ReferralList} />
            <RootStack.Screen name="Incentive" component={Incentive} />
            <RootStack.Screen name="IncentiveTask" component={IncentiveTask} />
            <RootStack.Screen name="EditDetails" component={EditDetails} />
            <RootStack.Screen name="CompanyDetails" component={CompanyDetails} />

          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
