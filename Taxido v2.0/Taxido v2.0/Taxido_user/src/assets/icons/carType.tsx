import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import React from "react";
import SvgComponentProps from "./type";

export function CarType({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={22} fill="none">
      <G
        stroke={color || "#8F8F8F"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={22.926}
        strokeWidth={1.2}
        clipPath="url(#a)"
      >
        <Path d="M19.588 8.946 17 4.721a2.515 2.515 0 0 0-2.2-1.232H7.936c-.923 0-1.716.445-2.198 1.232L3.162 8.923M20.865 16.337v1.327A1.04 1.04 0 0 1 19.83 18.7h-1.924a1.04 1.04 0 0 1-1.036-1.036V16.38M5.87 16.337v1.327A1.04 1.04 0 0 1 4.832 18.7H2.909a1.04 1.04 0 0 1-1.036-1.036v-1.327" />
        <Path d="M3.811 8.903h15.116c1.493 0 2.712 1.178 2.712 2.621v3.524c0 .71-.6 1.289-1.334 1.289H2.433c-.734 0-1.333-.58-1.333-1.29v-3.523c0-1.443 1.218-2.62 2.711-2.62Z" />
        <Path d="M2.382 11.335a2.498 2.498 0 0 1 2.327 2.487v.086h-3.61v-1.372c0-.345.13-.642.381-.878.252-.236.557-.345.902-.322ZM20.356 11.335a2.498 2.498 0 0 0-2.327 2.487v.086h3.61v-1.372c0-.345-.13-.642-.381-.878a1.163 1.163 0 0 0-.902-.322ZM6.385 11.31h9.969c-.288.622-.574 1.245-.86 1.869a1.265 1.265 0 0 1-1.172.752H8.414c-.516 0-.957-.283-1.172-.752l-.857-1.87Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
