import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export function Save() {
    return (
        <Svg  width={20} height={20} fill="none">
        <G clipPath="url(#a)">
          <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.017 1.667H5.983a3.224 3.224 0 0 0-3.216 3.216v11.742c0 1.5 1.075 2.133 2.391 1.408l4.067-2.258c.433-.242 1.133-.242 1.558 0l4.067 2.258c1.317.734 2.392.1 2.392-1.408V4.883a3.237 3.237 0 0 0-3.225-3.216Z"
          />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path fill="#fff" d="M0 0h20v20H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    )
}
