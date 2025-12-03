import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import appColors from '../../theme/appColors'
const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <G
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <Path d="M12.75 15.375h-7.5c-2.25 0-3.75-1.125-3.75-3.75v-5.25c0-2.625 1.5-3.75 3.75-3.75h7.5c2.25 0 3.75 1.125 3.75 3.75v5.25c0 2.625-1.5 3.75-3.75 3.75Z" />
      <Path d="m12.75 6.75-2.348 1.875c-.772.615-2.04.615-2.812 0L5.25 6.75" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
