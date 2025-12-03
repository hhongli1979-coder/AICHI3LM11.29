import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import appColors from '../../theme/appColors'

const SvgComponent = () => (
    <Svg width={22} height={22} fill="none">
        <G
            stroke={appColors.primary}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            clipPath="url(#a)"
        >
            <Path d="M3 11h16M11 19V3" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={appColors.white} d="M0 0h22v22H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
