import { useValues } from "@src/utils/context/index";
import { appColors } from "@src/themes"
import * as React from "react"
import Svg, { Path } from "react-native-svg"


export function LeftArrow() {
    const { isDark } = useValues()
    return (
        <Svg width={6} height={12} fill="none">
            <Path fill={isDark ? appColors.whiteColor : "#1F1F1F"} d="m5.558.533-5.48 5.48 5.48 5.478" />
        </Svg>
    )
}
