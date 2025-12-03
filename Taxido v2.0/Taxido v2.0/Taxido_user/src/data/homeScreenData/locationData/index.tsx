import { ReactNode } from 'react';
import { Home, Office } from '@utils/icons';
import { appColors } from '@src/themes'; 

export const locationData: Array<{ id: number; title: string; icon: ReactNode }> =
  [
    {
      id: 0,
      title: 'Home',
      icon: <Home colors={appColors.primary} />,
    },
    {
      id: 1,
      title: 'Office',
      icon: <Office colors={appColors.primary} />,
    },
  ];
