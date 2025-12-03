import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { MyTabs } from "./myTab/index";
import { Splash } from '../screens/intro/splash'
import { Onboarding } from '../screens/intro/onBoarding'
import { OtpVerification } from '../screens/auth/otpVerification'
import { SignUp } from '../screens/auth/signUp'
import { Notifications } from "../screens/notificationScreen/index";
import { HomeScreen } from "../screens/homeScreen/home";
import { DateTimeSchedule } from "../screens/dateTimeSchedule/index";
import { EditProfile } from "../screens/bottomTab/profileTab/editProfile";
import { PromoCodeScreen } from "../screens/bottomTab/profileTab/promoCode";
import { SavedLocation } from "../screens/bottomTab/profileTab/savedLocation";
import { AppPageScreen } from "../screens/bottomTab/profileTab/appPageScreen";
import { CompleteRide } from "../screens/bottomTab/myRide/completeRideScreen/completeRide";
import { PendingRideScreen } from "../screens/bottomTab/myRide/pendingRideScreen";
import { CancelRideScreen } from "../screens/bottomTab/myRide/cancelRide/index";
import { FindingDriver } from "../screens/bottomTab/category/findingDriver";
import { Outstation } from "../screens/outStation/index";
import { LocationDrop } from "../screens/locationDrop/index";
import { AddNewRider } from "../screens/chooseRider/addNewRider/index";
import { BookRide } from "../screens/bookRide/index";
import { OnTheWayDetails } from "../screens/driverDetail/onTheWayDetails/index";
import { DriverInfos } from "../screens/driverDetail/driverInfo/index";
import { ChatScreen } from "../screens/chatScreen/index";
import { Wallet } from "../screens/wallet/index";
import { TopUpWallet } from "../screens/topUpWallet/index";
import { RideActive } from "../screens/rideActive/index";
import { Payment } from "../screens/payment/index";
import { PaymentMethod } from "../screens/paymentMethod/index";
import { HomeService } from "../screens/homeService/index";
import { ActiveRideScreen } from "../screens/bottomTab/myRide/activeRideScreen";
import { ScheduleRideScreen } from "../screens/bottomTab/myRide/scheduleRideScreen";
import { LocationSelect } from "../screens/locationSelect";
import { ChooseRiderScreen } from "../screens/chooseRider/chooseRideScreen/index";
import { AddLocation } from "../screens/addLocation/index";
import { DriverDetails } from "../screens/bottomTab/category/driverDetails";
import { Calander } from "../screens/homeScreen/component/index";
import { PaymentWebView } from "../screens/paymentWebview/index";
import { DetailContainer } from "../screens/bottomTab/category/selectRide/container/detailContainer/index";
import { RentalLocation } from "../screens/rentalLocation/index";
import { RentalLocationSearch } from "../screens/rentalLocationSearch/index";
import { RentalBooking } from "../screens/rentalBooking/index";
import { SupportTicket } from "../screens/ticket/supportTicket";
import { TicketDetails } from "../screens/ticket/ticketDetails";
import { RentalCarDetails } from "../screens/rentalCarDetail/index";
import { PaymentRental } from "../screens/paymentRental/index";
import { PromoCodeDetail } from "../screens/bottomTab/profileTab/promoCodeDetail";
import { RentalVehicleSelect } from "../screens/rentalVehicleSelect/index";
import { CreateTicket } from "../screens/ticket/createTicket/index";
import { NoService } from "../screens/noService";
import { AmbulancePayment } from "../screens/ambulance/ambulancePayment";
import { AmbulanceHome } from "../screens/ambulance/ambulanceHome";
import { NoInternet } from "../components/noInternet";
import { SignIn } from "../screens/auth/signIn/index";
import { LocationSave } from "@src/screens/bottomTab/profileTab/savedLocation/component/locationSave";
import { AmbulanceSearch } from "../screens/ambulance/ambulanceSearch";
import { BookAmbulance } from "../screens/ambulance/bookAmbulance";
import { CarpoolingHome } from "../screens/carpooling/carpoolingHome";
import { PublishRide } from "../screens/carpooling/publishRide";
import NetInfo from '@react-native-community/netinfo';
import { AddVehicle } from "../screens/carpooling/addVehicle";
import { FindDriverHome } from "../screens/findDriver/findDriverHome";
import { OneWaySelect } from "../screens/findDriver/oneWaySelect";
import { OneWayDaily } from "../screens/findDriver/oneWayDaily";
import { OneWayRideDetails } from "../screens/findDriver/oneWayRideDetails";
import { PdfViewer } from "../screens/PdfViewer";
import { NoInternalServer } from "@src/components/noInternalServer";
import { carpoolingDate, CarpoolingDetails, EditStopOver, EditVehicle, PriceSet, ReferralList, SeatSet } from "@src/screens";
import { ReferralID } from "@src/screens/referralID";
import { Stopover } from "@src/screens/carpooling/stopover";
import { AddressChange } from "@src/screens/payment/addressChange";
import { EditDetails } from "@src/screens/bottomTab/profileTab/editProfile/editDetails";

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyStack: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
  }, []);



  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isConnected ? (
          <Stack.Screen name="NoInternet" component={NoInternet} />
        ) : (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="OtpVerification" component={OtpVerification} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="MyTabs" component={MyTabs} />
            <Stack.Screen name="PromoCodeScreen" component={PromoCodeScreen} />
            <Stack.Screen name="SavedLocation" component={SavedLocation} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="AppPageScreen" component={AppPageScreen} />
            <Stack.Screen name="CompleteRide" component={CompleteRide} />
            <Stack.Screen name="LocationSelect" component={LocationSelect} />
            <Stack.Screen name="ActiveRideScreen" component={ActiveRideScreen} />
            <Stack.Screen name="CancelRideScreen" component={CancelRideScreen} />
            <Stack.Screen name="PendingRideScreen" component={PendingRideScreen} />
            <Stack.Screen name="ScheduleRideScreen" component={ScheduleRideScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="DateTimeSchedule" component={DateTimeSchedule} />
            <Stack.Screen name="Rental" component={DetailContainer} />
            <Stack.Screen name="DriverDetails" component={DriverDetails} />
            <Stack.Screen name="FindingDriver" component={FindingDriver} />
            <Stack.Screen name="Outstation" component={Outstation} />
            <Stack.Screen name="Ride" component={LocationDrop} />
            <Stack.Screen name="AddNewRider" component={AddNewRider} />
            <Stack.Screen name="BookRide" component={BookRide} />
            <Stack.Screen name="OnTheWayDetails" component={OnTheWayDetails} />
            <Stack.Screen name="DriverInfos" component={DriverInfos} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="RideActive" component={RideActive} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="PaymentRental" component={PaymentRental} />
            <Stack.Screen name="Calander" component={Calander} />
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="PromoCodeDetail" component={PromoCodeDetail} />
            <Stack.Screen name="AddLocation" component={AddLocation} />
            <Stack.Screen name="TopUpWallet" component={TopUpWallet} />
            <Stack.Screen name="HomeService" component={HomeService} />
            <Stack.Screen name="PaymentWebView" component={PaymentWebView} />
            <Stack.Screen name="RentalLocation" component={RentalLocation} />
            <Stack.Screen name="RentalLocationSearch" component={RentalLocationSearch} />
            <Stack.Screen name="LocationSave" component={LocationSave} />
            <Stack.Screen name="RentalBooking" component={RentalBooking} />
            <Stack.Screen name="RentalVehicleSelect" component={RentalVehicleSelect} />
            <Stack.Screen name="CreateTicket" component={CreateTicket} />
            <Stack.Screen name="SupportTicket" component={SupportTicket} />
            <Stack.Screen name="TicketDetails" component={TicketDetails} />
            <Stack.Screen name="RentalCarDetails" component={RentalCarDetails} />
            <Stack.Screen name="AmbulanceSearch" component={AmbulanceSearch} />
            <Stack.Screen name="BookAmbulance" component={BookAmbulance} />
            <Stack.Screen name="AmbulancePayment" component={AmbulancePayment} />
            <Stack.Screen name="CarpoolingHome" component={CarpoolingHome} />
            <Stack.Screen name="PublishRide" component={PublishRide} />
            <Stack.Screen name="AddVehicle" component={AddVehicle} />
            <Stack.Screen name="NoService" component={NoService} />
            <Stack.Screen name="FindDriverHome" component={FindDriverHome} />
            <Stack.Screen name="OneWaySelect" component={OneWaySelect} />
            <Stack.Screen name="OneWayRideDetails" component={OneWayRideDetails} />
            <Stack.Screen name="OneWayDaily" component={OneWayDaily} />
            <Stack.Screen name="AmbulanceHome" component={AmbulanceHome} />
            <Stack.Screen name="PdfViewer" component={PdfViewer} />
            <Stack.Screen name="NoInternalServer" component={NoInternalServer} />
            <Stack.Screen name="ChooseRiderScreen" component={ChooseRiderScreen} />
            <Stack.Screen name="ReferralList" component={ReferralList} />
            <Stack.Screen name="ReferralID" component={ReferralID} />
            <Stack.Screen name="Stopover" component={Stopover} />
            <Stack.Screen name="EditStopOver" component={EditStopOver} />
            <Stack.Screen name="carpoolingDate" component={carpoolingDate} />
            <Stack.Screen name="EditVehicle" component={EditVehicle} />
            <Stack.Screen name="SeatSet" component={SeatSet} />
            <Stack.Screen name="PriceSet" component={PriceSet} />
            <Stack.Screen name="CarpoolingDetails" component={CarpoolingDetails} />
            <Stack.Screen name="AddressChange" component={AddressChange} />
            <Stack.Screen name="EditDetails" component={EditDetails} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;



