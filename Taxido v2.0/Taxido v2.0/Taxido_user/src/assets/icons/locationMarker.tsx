import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export function LocationMarker() {
    return (
        <Svg width={16} height={16} fill="none">
            <G clipPath="url(#a)">
                <Path
                    fill="#fff"
                    d="M15.805.195A.668.668 0 0 0 15.08.05l-14.667 6a.666.666 0 0 0 .133 1.274l6.88 1.25 1.25 6.88a.666.666 0 0 0 1.274.132l6-14.666a.666.666 0 0 0-.146-.724Z"
                />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h16v16H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
