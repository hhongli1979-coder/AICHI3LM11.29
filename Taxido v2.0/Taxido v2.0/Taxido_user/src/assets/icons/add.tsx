import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { appColors } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import SvgComponentProps from './type';


export function Add({ colors }: SvgComponentProps) {

  const { isDark } = useValues();

  const strokeColor = colors || (isDark ? appColors.whiteColor : appColors.blackColor);

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 12H18"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.0001 18V6"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
