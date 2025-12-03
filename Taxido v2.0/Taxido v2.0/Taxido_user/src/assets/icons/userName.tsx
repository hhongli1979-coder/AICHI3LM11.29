import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import SvgComponentProps from "./type"


export function UserName(props: SvgComponentProps) {
    return (

        <Svg
            width={20}
            height={20}
            fill="none"
            {...props}
        >
            <G
                stroke="#8F8F8F"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                clipPath="url(#a)"
            >
                <Path d="M10 10a4.167 4.167 0 1 0 0-8.333A4.167 4.167 0 0 0 10 10ZM17.158 18.333c0-3.225-3.208-5.833-7.158-5.833s-7.158 2.608-7.158 5.833" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
