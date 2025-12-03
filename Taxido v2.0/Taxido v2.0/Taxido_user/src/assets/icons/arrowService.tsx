import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export function ArrowService() {
    return (
        <Svg width={12} height={12} fill="none">
            <G clipPath="url(#a)">
                <Path
                    stroke="#199675"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={1.5}
                    d="m4.453 9.96 3.26-3.26a.993.993 0 0 0 0-1.4l-3.26-3.26"
                />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h12v12H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
