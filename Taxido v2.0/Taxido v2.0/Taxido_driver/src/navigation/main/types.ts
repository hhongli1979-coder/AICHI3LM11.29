
export type OtpScreen = {
  countryCode?: string;
  phoneNumber?: string;
  demouser?: boolean;
  cca2?: string;
  userType?: string;
  confirmation?: any;
  smsGateway?: string
}


export type OtpVerifyScreen = {
  email?: string,
  demouser?: string | any
}

export type CreateAccountScreen = {
  countryCode?: string;
  phoneNumber?: string;
  demouser?: boolean;
  cca2?: string;
  userType?: string;
  confirmation?: any;
  smsGateway?: string
}

export type OtpRide = {
  rideData?: any,
  ride_Id?: number | string | null
}


export type RideDetails = {
  ride_Id?: number | string | null,

}

export type RideComplete = {
  rideData?: any,

}


export type AddDocument = {
  formDatas?: any,

}

export type Chat = {
  driverId?: number,
  from: string,
  riderName?: string,
  setUnreadCount?: any

}

export type TicketDetails = {
  ticketData?: any

}

export type PaymentWebView = {
  url?: any
  selectedPaymentMethod?: string
  dataValue?: string

}


export type DocumentDetail = {
  NavValue: number
}


export type RootStackParamList = {
  Splash: undefined
  OnBoarding: undefined
  Login: undefined
  LoginMail: undefined
  Otp: OtpScreen
  Registration: undefined
  DocumentVerify: undefined
  VehicleRegistration: undefined
  BankDetail: undefined
  TabNav: undefined
  CreateAccount: CreateAccountScreen
  Settings: undefined
  AppSettings: undefined
  MyWallet: undefined
  TopupWallet: undefined
  Chat: Chat
  AddNewOffer: undefined
  OfferList: undefined
  ProfileSetting: undefined
  EndRide: undefined
  RentalDetails: undefined
  DocumentDetail: DocumentDetail
  BankDetails: undefined
  VehicleDetail: undefined
  Notification: undefined
  Subscription: undefined
  Map: any
  AddVehicle: undefined
  VehicleList: undefined
  ResetPassword: undefined
  OtpVerify: OtpVerifyScreen
  SupportTicket: undefined
  CreateTicket: undefined
  TicketDetails: TicketDetails
  PaymentSelect: undefined
  PaymentWebView: PaymentWebView
  AcceptFare: undefined
  ActiveRide: undefined
  Home: undefined
  OtpRide: OtpRide
  Ride: undefined
  RideComplete: RideComplete
  RideDetails: any
  MyRide: undefined
  CompleteRide: undefined
  CancelRide: undefined
  PendingRide: undefined
  PendingDetails: undefined
  CompleteDetails: undefined
  CancelDetails: undefined
  MapDetails: undefined
  NoService: undefined
  UploadedDocument: undefined
  FleetDetails: undefined
  RideInfo: undefined
  Verification: undefined
  AmbulanceTrack: undefined
  DriverList: undefined
  ManageVehicle: undefined
  TopUp: undefined
  TotalEarnings: undefined
  DashBoard: undefined
  MapWebView: any
  PdfViewer: undefined
  AddVehicleDetails: undefined
  AddDocument: AddDocument
  NoInternalServer: undefined,
  NoInternet: undefined,
  AddDriverDetails: undefined,
  AddDriverDocument: undefined
}
