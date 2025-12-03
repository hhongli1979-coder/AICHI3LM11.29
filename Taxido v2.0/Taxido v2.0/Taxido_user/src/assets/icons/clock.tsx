import Svg, { Path } from 'react-native-svg';
import React from 'react';
import SvgComponentProps from './type';

export function Clock({ color }: SvgComponentProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M18.3334 9.99996C18.3334 14.6 14.6 18.3333 10 18.3333C5.40002 18.3333 1.66669 14.6 1.66669 9.99996C1.66669 5.39996 5.40002 1.66663 10 1.66663C14.6 1.66663 18.3334 5.39996 18.3334 9.99996Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.0917 12.65L10.5083 11.1083C10.0583 10.8416 9.69165 10.2 9.69165 9.67497V6.2583"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
