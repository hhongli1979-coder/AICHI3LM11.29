import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export function CarSmall() {
    return (
        <Svg width={18} height={18} fill="none">
            <G
                stroke="#777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                clipPath="url(#a)"
            >
                <Path d="M11.633 2.123H6.368c-1.868 0-2.28.93-2.52 2.07L3 8.25h12l-.848-4.057c-.24-1.14-.652-2.07-2.52-2.07ZM16.492 14.865c.082.877-.623 1.635-1.523 1.635h-1.41c-.81 0-.922-.345-1.065-.773l-.15-.45c-.21-.614-.345-1.027-1.425-1.027H7.08c-1.08 0-1.237.465-1.425 1.027l-.15.45c-.142.428-.255.773-1.065.773H3.03c-.9 0-1.605-.758-1.522-1.635l.42-4.568c.105-1.125.322-2.047 2.287-2.047h9.57c1.965 0 2.183.922 2.288 2.047l.42 4.568ZM3 6h-.75M15.75 6H15M9 2.25v1.5M7.875 3.75h2.25M4.5 11.25h2.25M11.25 11.25h2.25" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h18v18H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
