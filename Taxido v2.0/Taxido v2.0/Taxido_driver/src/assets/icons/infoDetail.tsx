import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = () => (
    <Svg width={20} height={20} fill="none">
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 18.333c4.583 0 8.333-3.75 8.333-8.333s-3.75-8.333-8.334-8.333c-4.583 0-8.333 3.75-8.333 8.333s3.75 8.333 8.333 8.333ZM10 6.667v4.166"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.996 13.333h.008"
        />
    </Svg>
)
export default SvgComponent
