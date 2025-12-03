import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
export function HistoryEmpty() {

    return (
        <Svg width={22} height={22} fill="none">
            <G
                stroke="#8F8F8F"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                clipPath="url(#a)"
            >
                <Path d="M20.165 11c0 5.06-4.106 9.167-9.166 9.167-5.06 0-9.167-4.107-9.167-9.167s4.107-9.166 9.167-9.166S20.165 5.94 20.165 11Z" />
                <Path d="M14.4 13.915 11.56 12.22c-.495-.293-.899-.999-.899-1.576V6.884" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#8F8F8F" d="M0 0h22v22H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}