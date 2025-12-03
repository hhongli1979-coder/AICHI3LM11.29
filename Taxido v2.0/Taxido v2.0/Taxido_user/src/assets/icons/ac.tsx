import { appColors } from "@src/themes";
import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
import SvgComponentProps from "./type";

export function Ac({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={23} fill="none">
      <Mask
        id="a"
        width={22}
        height={23}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path
          fill="#fff"
          stroke="#fff"
          strokeWidth={1.2}
          d="M21.4 21.466V.666H.6v20.8h20.8Z"
        />
      </Mask>
      <G stroke={color || appColors.regularText} strokeWidth={1.2} mask="url(#a)">
        <Path
          fill={color || appColors.regularText}
          d="M18.777 5.31a.045.045 0 1 0 0-.089.045.045 0 0 0 0 .09Z"
        />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          d="M17.488 9.133H4.512l-1.29 1.289v1.289h15.555v-1.29l-1.289-1.288ZM5.844 14.29c0 2.847-2.352 5.155-5.2 5.155M21.355 19.445c-2.847 0-5.199-2.308-5.199-5.156M8.422 14.29v2.577a2.578 2.578 0 0 1-2.578 2.578M13.578 14.29v2.577a2.578 2.578 0 0 0 2.578 2.578M11 14.29v5.155"
        />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          d="M18.777 10.422h1.29l1.288-1.29V2.689H.645v6.445l1.289 1.289h1.289"
        />
      </G>
    </Svg>
  );
}
