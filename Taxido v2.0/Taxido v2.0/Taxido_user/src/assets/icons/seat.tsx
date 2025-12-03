import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import React from "react";
import { appColors } from "@src/themes";
import SvgComponentProps from "./type";

export function Seat({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={22} fill="none">
      <G
        stroke={color || appColors.regularText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        clipPath="url(#a)"
      >
        <Path d="M7.87 17.039V9.39h6.263v7.648" />
        <Path d="m5.06 15.87.04-.295c.278-2.09.348-3.288.208-5.393l-.127-1.9a1.72 1.72 0 0 1 1.72-1.833h8.2c.997 0 1.786.84 1.72 1.832l-.127 1.901c-.14 2.105-.07 3.302.208 5.393l.033.243m-7.7-9.669V4.702m3.532 0V6.15M7.174 17.786c.837-.794 2.239-1.315 3.827-1.315 1.603 0 3.015.53 3.85 1.337" />
        <Path d="M17.166 16.126c-1.23 0-2.226.994-2.226 2.22a.65.65 0 0 1-.65.648H7.711a.65.65 0 0 1-.65-.648c0-1.226-.998-2.22-2.228-2.22-1.23 0-2.227.994-2.227 2.22A3.187 3.187 0 0 0 5.8 21.527H16.2a3.187 3.187 0 0 0 3.192-3.181c0-1.226-.997-2.22-2.227-2.22ZM13.996 4.274H8.004a1.054 1.054 0 0 1-1.049-1.179L7.16 1.4c.064-.53.514-.927 1.049-.927h5.582c.534 0 .985.398 1.049.927l.205 1.695a1.054 1.054 0 0 1-1.05 1.18Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
