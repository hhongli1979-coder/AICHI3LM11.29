import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import React from 'react';
import { useValues } from "@src/utils/context/index";

export function HomeLocation() {
  const { iconColorStyle } = useValues();
  return (
    <Svg width={20} height={20} fill="none">
      <G
        stroke={iconColorStyle}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        clipPath="url(#a)"
      >
        <Path d="m19.219 9.375-8.14-8.194a1.562 1.562 0 0 0-2.083-.004L.78 9.375" />
        <Path d="M17.656 8.203v8.672a2.344 2.344 0 0 1-2.343 2.344h-3.126v-5.235a2.148 2.148 0 1 0-4.296 0v5.235H4.687a2.344 2.344 0 0 1-2.343-2.344V7.93M8.125 8.36h3.867" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
