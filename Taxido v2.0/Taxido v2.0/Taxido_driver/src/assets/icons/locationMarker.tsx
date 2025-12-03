import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = () => (
    <Svg width={20} height={20} fill="none">
        <Path
            stroke="#777"
            strokeWidth={1.5}
            d="M10 11.192a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"
        />
        <Path
            stroke="#777"
            strokeWidth={1.5}
            d="M3.017 7.075C4.658-.142 15.35-.133 16.983 7.083c.959 4.233-1.675 7.817-3.983 10.034a4.328 4.328 0 0 1-6.008 0c-2.3-2.217-4.934-5.809-3.975-10.042Z"
        />
    </Svg>
)
export default SvgComponent
