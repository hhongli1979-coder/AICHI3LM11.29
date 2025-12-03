import Svg, { Path } from 'react-native-svg';
import React from 'react';

export function ClockSmall({ color }: { color?: string }) {
  const defaultColor = "#8F8F8F";
  const strokeColor = color || defaultColor;
  return (
    <Svg width={16} height={16} fill="none">
      <Path
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M14.667 8A6.67 6.67 0 0 1 8 14.666 6.67 6.67 0 0 1 1.333 8 6.67 6.67 0 0 1 8 1.333 6.67 6.67 0 0 1 14.667 8Z"
      />
      <Path
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M10.473 10.12 8.407 8.887c-.36-.213-.654-.727-.654-1.147V5.007"
      />
    </Svg>
  );
}