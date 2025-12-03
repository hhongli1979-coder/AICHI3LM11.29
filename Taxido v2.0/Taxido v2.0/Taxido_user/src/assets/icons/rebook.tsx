import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export function Rebook() {
    return (
        <Svg width={18} height={18} fill="none">
            <G
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                clipPath="url(#a)"
            >
                <Path d="M11.168 3.81A7.514 7.514 0 0 0 9 3.487 6.5 6.5 0 0 0 2.498 9.99a6.502 6.502 0 1 0 11.91-3.608M12.098 3.99 9.93 1.5M12.098 3.99 9.57 5.835" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h18v18H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
