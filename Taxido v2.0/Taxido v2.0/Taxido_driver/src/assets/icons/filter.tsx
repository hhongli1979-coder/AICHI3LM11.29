import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'

const SvgComponent = ({color}:any) => (
    <Svg width={22} height={22} fill="none">
        <Path
            stroke={color?color:"#1F1F1F"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="M16.043 20.166v-5.5M16.043 5.5V1.835M12.833 9.167a3.208 3.208 0 1 0 6.417 0 3.208 3.208 0 0 0-6.417 0ZM5.957 20.167V16.5M5.957 7.334v-5.5M2.751 12.833a3.208 3.208 0 1 0 6.417 0 3.208 3.208 0 0 0-6.417 0Z"
        />
    </Svg>
)
export default SvgComponent
