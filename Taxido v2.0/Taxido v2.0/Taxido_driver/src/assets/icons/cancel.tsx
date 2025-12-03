import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = () => (
    <Svg width={24} height={24} fill="none">
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m7 7 10 10M7 17 17 7"
        />
    </Svg>
)
export default SvgComponent