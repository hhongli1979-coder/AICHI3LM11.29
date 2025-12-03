import { useValues } from "@src/utils/context";
import * as React from "react"
import Svg, { Path } from "react-native-svg"



export function PrivacyPolicIcon() {
    const { iconColorStyle } = useValues();
    return (
        <Svg width={18} height={18} fill="none">
            <Path
                stroke={iconColorStyle}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.2}
                d="M9 .703 2.11 3.564v3.478c0 4.5 2.723 8.554 6.89 10.255a11.077 11.077 0 0 0 6.89-10.255V3.564L9 .704Z"
            />
            <Path
                stroke={iconColorStyle}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.2}
                d="m6.258 8.441 1.965 1.965 3.52-3.52"
            />
        </Svg>
    )
}