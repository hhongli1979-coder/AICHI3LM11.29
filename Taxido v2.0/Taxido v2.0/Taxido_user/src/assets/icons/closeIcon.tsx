import * as React from "react"
import Svg, { Path } from "react-native-svg"
import SvgComponentProps from "./type"

export function CloseIcon({ fill }: SvgComponentProps) {
  return (
    <Svg width={14} height={14} fill="none">
      <Path
        stroke={fill ? fill : "#fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="m3.5 10.5 7-7M10.5 10.5l-7-7"
      />
    </Svg>
  )
}