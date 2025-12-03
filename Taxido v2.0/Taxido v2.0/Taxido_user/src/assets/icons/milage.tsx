import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import React from "react";
import { appColors } from "@src/themes";
import SvgComponentProps from "./type";

export function Milage({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={22} fill="none">
      <G
        stroke={color || appColors.regularText}
        strokeMiterlimit={10}
        strokeWidth={1.2}
        clipPath="url(#a)"
      >
        <Path d="M11 21.355A10.35 10.35 0 0 1 .645 11 10.35 10.35 0 0 1 11 .645 10.35 10.35 0 0 1 21.355 11 10.35 10.35 0 0 1 11 21.355ZM7.356 7.355 5.531 5.531M14.645 7.355l1.824-1.824M11 5.844V3.266" />
        <Path d="M11 3.266c-4.265 0-7.734 3.469-7.734 7.734h2.578A5.162 5.162 0 0 1 11 5.844 5.162 5.162 0 0 1 16.156 11h2.578c0-4.265-3.469-7.734-7.734-7.734Z" />
        <Path d="M12.29 12.29a1.29 1.29 0 1 1-2.58-.001 1.29 1.29 0 0 1 2.58 0ZM11 7.777V11M8.422 16.8v-1.288M9.71 18.09V16.8M11 16.8v-1.288M12.29 18.09V16.8M13.578 16.8v-1.288" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
