import {ReactNode} from 'react';

export interface itemData {
  screenName: string;
  icon: ReactNode;
  title: string;
}

export interface ProfileScreenTypes {
  item: itemData;
  index: number;
}
