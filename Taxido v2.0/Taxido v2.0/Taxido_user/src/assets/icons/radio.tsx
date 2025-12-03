import * as React from "react"
import Svg, { G, Rect, Defs, ClipPath, Path } from "react-native-svg"

export function Radio() {
    return (
        <Svg width={20} height={20} fill="none">
            <G fill="#CCC" clipPath="url(#a)">
                <Rect width={20} height={20} fillOpacity={0.3} rx={10} />
                <Rect width={10} height={10} x={5} y={5} rx={5} />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
