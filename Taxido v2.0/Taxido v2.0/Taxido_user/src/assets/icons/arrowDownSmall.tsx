import Svg, { Path } from "react-native-svg";
import React from "react";

export function ArrowDownSmall() {
  return (
    <Svg width={16} height={16} fill="none">
      <Path
        stroke="#8F8F8F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="m13.28 5.967-4.347 4.346a1.324 1.324 0 0 1-1.866 0L2.72 5.967"
      />
    </Svg>
  );
}
