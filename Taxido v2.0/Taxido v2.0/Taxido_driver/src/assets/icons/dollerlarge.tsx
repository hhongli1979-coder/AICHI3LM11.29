import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import appColors from '../../theme/appColors'

const SvgComponent = () => {
    return (
        <Svg width={22} height={22} fill="none">
            <G
                stroke={appColors.primary}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                clipPath="url(#a)"
            >
                <Path d="M7.95 13.136c0 1.183.907 2.136 2.034 2.136h2.301c.98 0 1.778-.834 1.778-1.861 0-1.118-.485-1.512-1.21-1.77L9.16 10.359c-.724-.256-1.21-.65-1.21-1.769 0-1.026.798-1.86 1.779-1.86h2.3c1.128 0 2.035.953 2.035 2.135M11 5.5v11" />
                <Path d="M10.999 20.166a9.167 9.167 0 1 0 0-18.333 9.167 9.167 0 0 0 0 18.333Z" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill={appColors.white} d="M0 0h22v22H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
export default SvgComponent
