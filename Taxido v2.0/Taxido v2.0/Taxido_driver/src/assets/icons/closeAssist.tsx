import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'

const SvgComponent = () => (
    <Svg width={22} height={22} fill="none">
        <G clipPath="url(#a)">
            <Path
                fill="#199675"
                d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11Z"
            />
            <Path
                fill="#fff"
                d="M16.231 9.588H5.769a.785.785 0 0 0-.785.785v1.255a.785.785 0 0 0 .785.785h10.462a.785.785 0 0 0 .785-.785v-1.255a.785.785 0 0 0-.785-.785Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h22v22H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
