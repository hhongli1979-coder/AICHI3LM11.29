import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { appColors } from '@src/themes';
import { useValues } from '@src/utils/context/index';

export function Search() {
  const { isDark } = useValues();
  const iconColorStyle = isDark ? appColors.whiteColor : appColors.primaryText;
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <Path
        d="M10.5417 19.25C15.3511 19.25 19.25 15.3512 19.25 10.5417C19.25 5.73223 15.3511 1.83337 10.5417 1.83337C5.73218 1.83337 1.83333 5.73223 1.83333 10.5417C1.83333 15.3512 5.73218 19.25 10.5417 19.25Z"
        stroke={iconColorStyle}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.1667 20.1667L18.3333 18.3334"
        stroke={iconColorStyle}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
