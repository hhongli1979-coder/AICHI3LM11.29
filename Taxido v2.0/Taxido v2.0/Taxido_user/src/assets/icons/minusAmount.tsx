import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function MinusAmount() {
  return (
    <Svg fill="none">
      <Path
        stroke="#20B149"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="m3.125 2.188 8.75 8.75M3.125 8.606V2.188h6.419"
      />
    </Svg>
  )
}