import {ReactNode} from 'react';

export interface notificationDataProps {
  item: {
    icon: ReactNode;
    title: string;
    subtitle: string;
    time: string;
  };
}
