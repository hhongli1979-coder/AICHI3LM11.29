import { appColors } from "@src/themes"
import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export function HistoryFill() {

    return (
        <Svg width={22} height={22} fill="none">
            <G clipPath="url(#a)">
                <Path
                    fill={appColors.primary}
                    d="M10.999 1.833C5.948 1.833 1.832 5.95 1.832 11s4.116 9.167 9.167 9.167c5.05 0 9.166-4.116 9.166-9.167 0-5.05-4.116-9.166-9.166-9.166Zm3.987 12.44a.684.684 0 0 1-.944.238L11.2 12.815c-.705-.421-1.228-1.347-1.228-2.163V6.894c0-.376.312-.688.688-.688.375 0 .687.312.687.688v3.758c0 .33.275.816.56.98l2.84 1.697c.33.192.44.614.24.944Z"
                />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill={appColors.primary} d="M0 0h22v22H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}