import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function RightArrowSmall() {
    return (
        <Svg width={16} height={16} fill="none">
            <Path
                stroke="#777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.2}
                d="m5.941 2.72 4.347 4.346a1.324 1.324 0 0 1 0 1.867l-4.347 4.346"
            />
        </Svg>
    )
}