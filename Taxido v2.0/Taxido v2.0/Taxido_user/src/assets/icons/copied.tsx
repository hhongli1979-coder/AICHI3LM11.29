import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export function Copied() {
  return (
    <Svg width={20} height={20} fill="none">
      <G
        stroke="#199675"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        clipPath="url(#a)"
      >
        <Path d="M6.667 10.75v3.5c0 2.917 1.166 4.084 4.083 4.084h3.5c2.917 0 4.083-1.167 4.083-4.084v-3.5c0-2.916-1.166-4.083-4.083-4.083h-3.5c-2.917 0-4.083 1.167-4.083 4.083Z" />
        <Path d="M1.667 5.75v3.5c0 2.917 1.166 4.084 4.083 4.084h.917V10.75c0-2.916 1.166-4.083 4.083-4.083h2.583V5.75c0-2.916-1.166-4.083-4.083-4.083h-3.5c-2.917 0-4.083 1.167-4.083 4.083Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M20 0H0v20h20z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
