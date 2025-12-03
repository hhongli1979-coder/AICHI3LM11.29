import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function ArrowUpSmall() {
    return (
        <Svg width={16} height={16} fill="none">
            <Path
                stroke="#777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.2}
                d="M13.279 10.06 8.932 5.713a1.324 1.324 0 0 0-1.867 0L2.72 10.06"
            />
        </Svg>
    )
}
