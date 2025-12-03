import react from 'react';
import { ImageSourcePropType } from 'react-native';

export interface BookRideItemType {
  item: {
    img?: ImageSourcePropType;
    title?: string;
    charges?: any;
    id?: number;
    name?: string;
    vehicle_image_url?: any,
    currency_symbol?: string | number
  };
  onPress: any;
  onPressAlternate: any;
  isSelected: boolean;
  isDisabled: boolean;
  couponsData?: any;
  onPriceCalculated?: any;
  selectedPrefsValue?: any;
}

export interface ItemType {
  item: {
    title: string;
    charges?: any;
    id?: number;
    name?: string;
    vehicle_image_url?: any
    currency_symbol?: string | number
  };
}