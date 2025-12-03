import { useValues } from "@src/utils/context/index";
import * as React from "react"
import Svg, { Path } from "react-native-svg"
import SvgComponentProps from "./type";

export function HelpSupport({ color }: SvgComponentProps) {
  const { iconColorStyle } = useValues();
  return (
    <Svg width={16} height={18} fill="none">
      <Path
        stroke={color || iconColorStyle}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        d="M3.781 11.672a1.406 1.406 0 0 1-2.812 0V9.14a1.406 1.406 0 0 1 2.812 0v2.53Zm11.25 0a1.406 1.406 0 0 1-2.812 0V9.14a1.406 1.406 0 0 1 2.812 0v2.53Z"
      />
      <Path
        stroke={color || iconColorStyle}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        d="M.969 9.14V7.735a7.031 7.031 0 1 1 14.062 0v1.407m0 2.53v1.407a2.812 2.812 0 0 1-2.812 2.813H9.406"
      />
      <Path
        stroke={color || iconColorStyle}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        d="M8 17.297a1.406 1.406 0 1 0 0-2.813 1.406 1.406 0 0 0 0 2.813Z"
      />
    </Svg>
  )
}

