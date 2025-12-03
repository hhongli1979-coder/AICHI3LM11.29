import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import React from 'react';

export function TopUp() {
    return (
        <Svg width={22} height={22} fill="none">
            <G
                stroke="#199675"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                clipPath="url(#a)"
            >
                <Path d="M3 11h16M11 19V3" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h22v22H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
