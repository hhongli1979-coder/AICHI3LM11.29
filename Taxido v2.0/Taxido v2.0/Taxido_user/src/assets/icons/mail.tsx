import React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export function Mail() {
  return (
    <Svg width={20} height={20} fill="none">
      <G
        stroke="#8F8F8F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        clipPath="url(#a)"
      >
        <Path d="M14.167 17.083H5.833c-2.5 0-4.166-1.25-4.166-4.166V7.083c0-2.916 1.666-4.166 4.166-4.166h8.334c2.5 0 4.166 1.25 4.166 4.166v5.834c0 2.916-1.666 4.166-4.166 4.166Z" />
        <Path d="m14.167 7.5-2.609 2.083c-.858.684-2.266.684-3.125 0L5.833 7.5" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
