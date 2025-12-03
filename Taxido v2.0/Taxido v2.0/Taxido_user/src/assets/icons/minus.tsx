import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { appColors } from "@src/themes"
import SvgComponentProps from "./type"

export function Minus({ colors }: SvgComponentProps) {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
                stroke={colors || appColors.primaryText}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 12h12"
            />
        </Svg>
    )
}