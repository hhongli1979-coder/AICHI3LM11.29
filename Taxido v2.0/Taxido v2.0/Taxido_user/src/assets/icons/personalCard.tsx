import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import SvgComponentProps from "./type"

export function PersonalCard(props: SvgComponentProps) {
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
                <Path d="M14.167 17.5H5.833c-3.333 0-4.166-.833-4.166-4.167V6.667c0-3.334.833-4.167 4.166-4.167h8.334c3.333 0 4.166.833 4.166 4.167v6.666c0 3.334-.833 4.167-4.166 4.167ZM11.667 6.667h4.166M12.5 10h3.333M14.167 13.333h1.666" />
                <Path d="M7.083 9.408a1.508 1.508 0 1 0 0-3.016 1.508 1.508 0 0 0 0 3.016ZM10 13.608a2.517 2.517 0 0 0-2.283-2.266 6.428 6.428 0 0 0-1.267 0 2.524 2.524 0 0 0-2.283 2.266" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
