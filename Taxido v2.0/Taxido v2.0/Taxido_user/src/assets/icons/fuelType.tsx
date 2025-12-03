import Svg, { Mask, Path, G } from "react-native-svg";
import React from "react";
import SvgComponentProps from "./type";

export function FuelType({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={22} fill="none">
      <Mask
        id="a"
        width={22}
        height={22}
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
          d="M21.4 21.4V.6H.6v20.8h20.8Z"
        />
      </Mask>
      <G
        stroke={color}
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        mask="url(#a)"
      >
        <Path d="M14.877 19.03H4.135V1.922c0-.64.52-1.16 1.16-1.16h8.422c.64 0 1.16.52 1.16 1.16V19.03Z" />
        <Path
          strokeLinecap="round"
          d="M10.65 14.583c-1.084 1.084-3.108.819-3.108.819s-.265-2.024.82-3.108c1.084-1.084 3.107-.819 3.107-.819s.266 2.024-.819 3.108Z"
        />
        <Path d="M14.765 19.03H4.248a1.38 1.38 0 0 0-1.38 1.381v.826h13.277v-.826a1.38 1.38 0 0 0-1.38-1.38ZM12.862 8.413H6.148v-5.63h6.714v5.63Z" />
        <Path
          strokeLinecap="round"
          d="M14.877 4.186h2.127m0 0c1.174 0 2.127.952 2.127 2.127v3.583a2.127 2.127 0 0 1-2.127-2.126V4.186ZM19.13 9.897v6.245a1.063 1.063 0 1 1-2.126 0v-1.64c0-.587-.476-1.063-1.064-1.063h-1.063"
        />
      </G>
    </Svg>
  );
}
