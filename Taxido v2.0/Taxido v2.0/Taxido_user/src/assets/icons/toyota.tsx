import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import { useValues } from "@src/utils/context/index";
import { appColors } from "@src/themes"
import SvgComponentProps from "./type";

export function Toyota(props: SvgComponentProps) {
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
                strokeWidth={1.5}
                clipPath="url(#a)"
            >
                <Path d="M12.924 2.358h-5.85c-2.075 0-2.534 1.034-2.8 2.3l-.942 4.509h13.333l-.941-4.509c-.267-1.266-.725-2.3-2.8-2.3Z" />
                <Path d="M18.325 16.517c.092.974-.691 1.816-1.691 1.816h-1.567c-.9 0-1.025-.383-1.183-.858l-.167-.5c-.233-.684-.383-1.142-1.583-1.142H7.867c-1.2 0-1.375.517-1.583 1.142l-.167.5c-.158.475-.283.858-1.183.858H3.367c-1 0-1.783-.841-1.692-1.816l.467-5.075c.117-1.25.358-2.276 2.542-2.276h10.633c2.183 0 2.425 1.025 2.542 2.275l.466 5.075ZM3.333 6.667H2.5M17.501 6.667h-.833M10 2.5v1.667M8.75 4.167h2.5M5 12.5h2.5M12.5 12.5H15" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill={isDark ? appColors.blackColor : appColors.whiteColor} d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}