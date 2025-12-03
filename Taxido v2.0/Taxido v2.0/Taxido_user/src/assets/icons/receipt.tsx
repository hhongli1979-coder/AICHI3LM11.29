import * as React from "react"
import Svg, { Path } from "react-native-svg"
import SvgComponentProps from "./type"

export function Receipt({ color }: SvgComponentProps) {
  return (
    <Svg width={18} height={18} fill="none">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        d="M16.5 4.5v1.815c0 1.185-.75 1.935-1.935 1.935H12V3.008c0-.833.682-1.508 1.515-1.508a3.015 3.015 0 0 1 2.107.877c.54.548.878 1.298.878 2.123Z"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        d="M1.5 5.25v10.5c0 .622.705.975 1.2.6l1.282-.96c.3-.225.72-.195.99.075l1.245 1.253a.756.756 0 0 0 1.066 0l1.26-1.26a.743.743 0 0 1 .975-.068l1.282.96a.752.752 0 0 0 1.2-.6V3c0-.825.675-1.5 1.5-1.5h-9c-2.25 0-3 1.342-3 3v.75Z"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M4.5 6.75H9M5.063 9.75h3.375"
      />
    </Svg>
  )
}