import {ImageSourcePropType} from 'react-native';

export interface CancelFareType {
  item: {
    id: number;
    img: ImageSourcePropType;
    title: string;
    price: string;
    subtitle: string;
    min: string;
    rating: string;
    km: string;
    totalRating: string;
  };
}
