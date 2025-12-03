import Svg, { Rect } from 'react-native-svg';
import React from 'react';
import { appColors } from '@src/themes'; 
import { useValues } from '@src/utils/context';

export function RadioBox() {

  const {isDark}=useValues()

  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Rect
        x="0.5"
        y="0.5"
        width="19"
        height="19"
        rx="9.5"
        stroke={isDark?appColors.darkBorder:appColors.primaryGray}
      />
    </Svg>
  );
}
