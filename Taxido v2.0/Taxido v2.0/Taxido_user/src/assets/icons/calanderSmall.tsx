import Svg, {Path} from 'react-native-svg';
import React from 'react';

export function CalenderSmall() {
  return (
    <Svg width={16} height={16} fill="none">
    <Path
      stroke="#8F8F8F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M5.333 1.333v2M10.667 1.333v2M2.333 6.06h11.334M14 5.666v5.667c0 2-1 3.333-3.333 3.333H5.333C3 14.666 2 13.333 2 11.333V5.666c0-2 1-3.333 3.333-3.333h5.334C13 2.333 14 3.666 14 5.666Z"
    />
    <Path
      stroke="#8F8F8F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M10.463 9.133h.006M10.463 11.133h.006M7.997 9.133h.006M7.997 11.133h.006M5.53 9.133h.006M5.53 11.133h.006"
    />
  </Svg>
  );
}
