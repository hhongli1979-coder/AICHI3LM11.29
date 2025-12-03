import {ImageSourcePropType} from 'react-native';
import {RootStackParamList} from '../../../../navigation/types';

export interface CategoryDetailTypes {
  item: {
    id: number;
    screenName: keyof RootStackParamList;
    subtitle: string;
    img: ImageSourcePropType;
    title: string;
  };
}
