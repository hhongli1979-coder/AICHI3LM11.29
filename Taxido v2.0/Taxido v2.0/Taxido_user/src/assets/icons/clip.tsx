import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Clip() {
  return (
    <Svg width={20} height={20} fill="none">
      <Path
        stroke="#808B97"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m10.275 10.126-2.058 2.058a2.912 2.912 0 0 0 0 4.125 2.912 2.912 0 0 0 4.125 0l3.241-3.241a5.84 5.84 0 0 0 0-8.25 5.84 5.84 0 0 0-8.25 0L3.8 8.35a5.01 5.01 0 0 0 0 7.075"
      />
    </Svg>
  );
}
