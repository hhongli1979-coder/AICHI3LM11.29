import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import React from "react";
import SvgComponentProps from "./type";

export function Cash({ colors }: SvgComponentProps) {
    return (
        <Svg width={20} height={20} fill="none">
            <G
                stroke={colors}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                clipPath="url(#a)"
            >
                <Path d="M4.48 14.414v-4.41h9.644v4.781" />
                <Path d="m10.804 12.314-1.478-.657-1.526.657v-2.31h3.004v2.31ZM9.208 17.516h1.8a2.232 2.232 0 0 0 1.798-.91l1.302-1.771a.9.9 0 0 1 1.513.97l-.558 1.006a5.435 5.435 0 0 1-4.752 2.798H2.917" />
                <Path d="M2.917 16.184c.402-1.163 1.568-1.997 2.867-1.997 1.111 0 2.08.61 2.588 1.514v0h2.056a.907.907 0 0 1 0 1.815H7.993h1.601M2.917 14.657H.391v4.952h2.526v-4.952ZM5.437 2.442A5.435 5.435 0 0 1 9.69.39h7.393M2.524 4.408a1.946 1.946 0 0 0 1.947-1.946M4.47 8.425a1.946 1.946 0 0 0-1.946-1.947M14.2 6.478a1.946 1.946 0 0 0-1.946 1.947" />
                <Path d="M6.484 8.438H2.5v-5.99h10.145M14.225 5.214v3.223H10" />
                <Path d="M17.046 4.065a2.967 2.967 0 0 1-4.42.301l-1.974.577a.907.907 0 0 1-.509-1.741l3.436-1.005-2.635.77M17.083 5.343h2.527V.39h-2.527v4.952ZM9.587 5.443a1.224 1.224 0 1 0-2.45 0 1.224 1.224 0 0 0 2.45 0Z" />
            </G>
            <Defs>
                <ClipPath id="a">
                    <Path fill="#fff" d="M0 0h20v20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
