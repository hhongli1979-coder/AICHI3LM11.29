import Svg, { Path } from "react-native-svg";
import React from "react";
import { appColors } from "@src/themes";
import SvgComponentProps from "./type";

export function Speed({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={22} fill="none">
      <Path
        stroke={color || appColors.regularText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={22.926}
        strokeWidth={1.1}
        d="M18.495 15.556h-.01m-1.69 0a7.398 7.398 0 0 0-1.687-4.72M4.348 8.108A9.78 9.78 0 0 1 11 5.5c5.468 0 9.9 4.502 9.9 10.056h-1.249M3.155 9.42a1.2 1.2 0 0 1 .011-.015m11.032.505A7.147 7.147 0 0 0 9.55 8.198c-4 0-7.244 3.294-7.244 7.358H1.1c0-1.889.513-3.655 1.404-5.165M11.355 14.649c.137.282.209.592.209.907 0 1.129-.901 2.044-2.013 2.044-1.111 0-2.012-.916-2.012-2.044 0-1.129.901-2.044 2.012-2.044.31 0 .616.072.893.212M15.825 11.876l3.364-1.973M13.174 9.183l1.65-2.905M9.551 8.198v-2.59M5.929 9.183l-.925-1.628M3.277 11.876l-1.192-.699"
      />
      <Path
        stroke={color || appColors.regularText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={22.926}
        strokeWidth={1.1}
        d="M15.575 9.436c.25.254.25.67 0 .925l-5.569 5.656a.639.639 0 0 1-.91 0 .663.663 0 0 1 0-.925l5.568-5.656a.639.639 0 0 1 .91 0Z"
      />
    </Svg>
  );
}
