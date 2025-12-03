import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Copy({ color }: any) {
  return (
    <Svg width={22} height={22} fill="none">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M15.583 12.284v2.75c0 3.666-1.466 5.133-5.133 5.133H6.967c-3.667 0-5.134-1.467-5.134-5.133V11.55c0-3.666 1.467-5.133 5.134-5.133h2.75"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M15.583 12.284H12.65c-2.2 0-2.933-.734-2.933-2.934V6.417l5.866 5.867ZM10.633 1.833H14.3M6.417 4.583a2.746 2.746 0 0 1 2.75-2.75h2.401M20.167 7.333v5.674a2.578 2.578 0 0 1-2.576 2.576M20.167 7.333h-2.75c-2.063 0-2.75-.687-2.75-2.75v-2.75l5.5 5.5Z"
      />
    </Svg>
  );
}
