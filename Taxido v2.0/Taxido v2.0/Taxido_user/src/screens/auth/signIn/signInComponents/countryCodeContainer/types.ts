import { DimensionValue } from 'react-native';

export interface CountryCodeType {
  width?: DimensionValue;
}

export interface CountryCodeContainerProps {
  countryCode?: string;
  setCountryCode?: (code: string) => void;
  phoneNumber?: string;
  setPhoneNumber?: any;
  width?: number | string;
  backGroundColor?: string;
  textBgColor?: string;
  borderColor?: string;
  borderColor1?: string;
  warning?: boolean;
  setCca2?: (code: string) => void;
  smsGateway?: string;
  error: any;
  setError: (val: string) => void;
};