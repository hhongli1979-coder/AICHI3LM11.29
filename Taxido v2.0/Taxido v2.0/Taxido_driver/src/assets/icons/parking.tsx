import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

const SvgComponent = () => (
    <Svg width={22} height={22} fill="none">
        <G fill="#FF8367" clipPath="url(#a)">
            <Path d="M12.102 6.6h-2.2V11h2.2a2.2 2.2 0 0 0 2.2-2.2c0-1.215-.991-2.2-2.2-2.2Z" />
            <Path d="M11 0C4.934 0 0 4.934 0 11s4.934 11 11 11 11-4.934 11-11S17.066 0 11 0Zm1.103 13.2h-2.2v4.08a.32.32 0 0 1-.32.32h-1.56a.32.32 0 0 1-.32-.32V4.72a.32.32 0 0 1 .32-.32h3.886c2.294 0 4.353 1.672 4.576 3.96.247 2.622-1.813 4.84-4.382 4.84Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h22v22H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
