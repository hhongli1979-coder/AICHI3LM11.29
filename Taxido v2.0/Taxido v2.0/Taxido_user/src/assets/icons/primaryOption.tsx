import { useValues } from "@src/utils/context/index";;
import { appColors } from "@src/themes";
import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export function PrimaryOption() {
  const { isDark } = useValues();
  const colorDark = isDark ? appColors.whiteColor : appColors.primaryText;

  return (
    <Svg width={18} height={18} fill="none">
      <G
        stroke={colorDark}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        clipPath="url(#a)"
      >
        <Path d="m9.757 2.19 4.425 1.965c1.275.563 1.275 1.493 0 2.055L9.757 8.175c-.502.225-1.327.225-1.83 0L3.502 6.21c-1.275-.562-1.275-1.492 0-2.055L7.927 2.19c.503-.225 1.328-.225 1.83 0Z" />
        <Path d="M2.25 8.25c0 .63.473 1.357 1.05 1.613l5.093 2.264c.39.173.832.173 1.214 0L14.7 9.864c.578-.255 1.05-.983 1.05-1.613" />
        <Path d="M2.25 12c0 .697.413 1.328 1.05 1.613l5.093 2.264c.39.173.832.173 1.214 0l5.093-2.264A1.768 1.768 0 0 0 15.75 12" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={colorDark} d="M0 0h18v18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}