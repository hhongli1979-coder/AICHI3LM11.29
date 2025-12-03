import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export function Preference() {
    return (
        <Svg width={18} height={18} fill="none">
            <G clipPath="url(#a)">
                <Path
                    fill="#199675"
                    d="M16.875 8.437h-1.752c-.596-2.576-4.303-2.573-4.897 0H1.125a.562.562 0 1 0 0 1.125h9.101c.594 2.577 4.303 2.574 4.897 0h1.752a.562.562 0 1 0 0-1.125Zm-15.75-4.5h1.524c.594 2.577 4.303 2.574 4.897 0h9.329a.562.562 0 1 0 0-1.125h-9.33C6.953.236 3.244.24 2.65 2.812H1.125a.562.562 0 1 0 0 1.125Zm15.75 10.125h-6.832c-.596-2.576-4.303-2.573-4.896 0H1.125a.562.562 0 1 0 0 1.126h4.022c.593 2.576 4.303 2.573 4.896 0h6.832a.562.562 0 1 0 0-1.126Z"
                />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h18v18H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}