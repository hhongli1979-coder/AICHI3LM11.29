import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import React from "react";

export function Gift() {
    return (
        <Svg width={22} height={22} fill="none">
            <G
                stroke="#199675"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
                clipPath="url(#a)"
            >
                <Path d="M11.002 18.25c-.553 0-4.143-2.554-4.143-5.178 0-1.143.929-2.07 2.071-2.07 1.657 0 2.072 1.656 2.072 1.656s.414-1.657 2.07-1.657c1.144 0 2.072.928 2.072 2.071 0 2.624-3.59 5.178-4.142 5.178ZM21.355 6.168a1.38 1.38 0 0 0-1.38-1.38H2.025a1.38 1.38 0 0 0-1.38 1.38v.69a1.38 1.38 0 0 0 1.38 1.381h17.95a1.38 1.38 0 0 0 1.38-1.38v-.69Z" />
                <Path d="M19.973 8.24H2.023v11.736c0 .762.619 1.38 1.381 1.38h15.188a1.38 1.38 0 0 0 1.38-1.38V8.24ZM11.001 4.788H6.17a2.072 2.072 0 0 1 0-4.142C8.93.646 11 4.788 11 4.788Zm0 0h4.833a2.072 2.072 0 0 0 0-4.142C13.072.646 11 4.788 11 4.788Z" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 .001h22v22H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
