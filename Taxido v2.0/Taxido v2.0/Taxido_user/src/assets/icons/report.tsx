import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import SvgComponentProps from "./type"

export function Report(props: SvgComponentProps) {
    return (
        <Svg
            width={20}
            height={20}
            fill="none"
            {...props}
        >
            <G
                stroke="#199675"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#a)"
            >
                <Path
                    strokeWidth={1.5}
                    d="M10 7.5v4.167M10 17.842H4.95c-2.89 0-4.1-2.067-2.7-4.592l2.6-4.683 2.45-4.4c1.484-2.675 3.917-2.675 5.4 0l2.45 4.408 2.6 4.684c1.4 2.525.184 4.591-2.7 4.591H10v-.008Z"
                />
                <Path strokeWidth={2} d="M9.996 14.166h.008" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}