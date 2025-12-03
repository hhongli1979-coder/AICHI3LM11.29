import * as React from "react"
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg"
import appColors from "../../theme/appColors"

const SvgComponent = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke={appColors.primary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="m13.279 5.967-4.347 4.346a1.324 1.324 0 0 1-1.867 0L2.72 5.967"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.whites} d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent