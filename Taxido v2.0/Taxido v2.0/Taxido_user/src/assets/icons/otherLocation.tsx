import { useValues } from "@src/utils/context/index";;
import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export function OtherLocation() {
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
        <Path d="M14.167 8.334h1.666c1.667 0 2.5-.834 2.5-2.5V4.167c0-1.667-.833-2.5-2.5-2.5h-1.666c-1.667 0-2.5.833-2.5 2.5v1.667c0 1.666.833 2.5 2.5 2.5ZM4.167 18.334h1.666c1.667 0 2.5-.834 2.5-2.5v-1.667c0-1.667-.833-2.5-2.5-2.5H4.167c-1.667 0-2.5.833-2.5 2.5v1.667c0 1.666.833 2.5 2.5 2.5ZM5 8.334a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667ZM15 18.334a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
