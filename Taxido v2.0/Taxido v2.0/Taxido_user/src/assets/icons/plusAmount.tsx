import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function PlusAmount() {
  return (
    <Svg fill="none">
      <Path
        stroke="#FF4B4B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="m3.125 10.938 8.75-8.75M3.125 4.519v6.418h6.419"
      />
    </Svg>
  )
}