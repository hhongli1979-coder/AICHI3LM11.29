import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function Swap() {
    return (
        <Svg
            width={18}
            height={18}
            fill="none"
        >
            <Path
                stroke="#777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m7.838 5.04-2.79-2.79-2.79 2.79M5.047 15.75V2.25M10.164 12.96l2.79 2.79 2.79-2.79M12.953 2.25v13.5"
            />
        </Svg>
    )
}
