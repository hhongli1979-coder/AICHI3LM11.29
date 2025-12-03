import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import appColors from '../../theme/appColors'

const CalanderSmall = () => (
  <Svg width={18} height={18} fill="none">
    <G
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      clipPath="url(#a)"
    >
      <Path
        strokeMiterlimit={10}
        d="M6 1.5v2.25M12 1.5v2.25M2.625 6.817h12.75M15.75 6.375v6.375c0 2.25-1.125 3.75-3.75 3.75H6c-2.625 0-3.75-1.5-3.75-3.75V6.375c0-2.25 1.125-3.75 3.75-3.75h6c2.625 0 3.75 1.5 3.75 3.75Z"
      />
      <Path d="M11.771 10.275h.007M11.771 12.525h.007M8.996 10.275h.007M8.996 12.525h.007M6.22 10.275h.007M6.22 12.525h.007" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default CalanderSmall
