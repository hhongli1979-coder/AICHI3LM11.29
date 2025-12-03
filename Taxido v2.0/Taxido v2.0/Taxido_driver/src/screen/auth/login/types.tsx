interface LoginViewProps {
  googleLogin?: () => void
  appleLogin?: () => void
  gotoOTP: any
  gotoRegistration?: () => void
  phoneNumber: string
  setPhoneNumber: (value: string) => void;
  countryCode?: string
  setCountryCode?: (value: string) => void;
  demouser?: any
  gotoOTPFleet?: any
  setDemouser?: any
  fleetLoading?: boolean;
  driverLoading?: boolean;
  setFleetLoading?: (value: boolean) => void;
  setDriverLoading: any;
  smsGateway?: string;
  borderColor?: any;
  setCca2?: any;
  email?: string;
  setEmail?: any

}
export default LoginViewProps
