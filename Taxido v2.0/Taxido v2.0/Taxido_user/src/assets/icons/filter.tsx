import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import { useValues } from "@src/utils/context/index";
import { appColors } from "@src/themes"
import SvgComponentProps from "./type";

export function Filter(props: SvgComponentProps) {
    const { isDark } = useValues()
    return (
        <Svg
            width={20}
            height={20}
            fill="none"
            {...props}
        >
            <G
                stroke={isDark ? appColors.whiteColor : appColors.primaryText}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
                clipPath="url(#a)"
            >
                <Path d="M15.832 18.333V9.167M15.832 5.833V1.666M10 18.333v-4.166M10 10.833V1.667M4.168 18.333V9.167M4.168 5.833V1.666M2.5 9.166h3.333M14.168 9.166h3.333M8.332 10.834h3.333" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill={isDark ? appColors.blackColor : appColors.whiteColor} d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}