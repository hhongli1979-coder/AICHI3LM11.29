import { useValues } from "@src/utils/context/index";
import { appColors } from "@src/themes"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function RightArrows() {
    const { isDark } = useValues()
    return (
        <Svg width={6} height={12} fill="none">
            <Path fill={isDark ? appColors.whiteColor : "#1F1F1F"} d="m.356 11.49 5.48-5.478L.355.532" />
        </Svg>
    )
}