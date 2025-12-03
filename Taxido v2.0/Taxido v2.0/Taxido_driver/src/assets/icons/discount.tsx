import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import appColors from '../../theme/appColors'
const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <G
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      clipPath="url(#a)"
    >
      <Path
        strokeWidth={1.5}
        d="M14.625 9.375c0-1.035.84-1.875 1.875-1.875v-.75c0-3-.75-3.75-3.75-3.75h-7.5c-3 0-3.75.75-3.75 3.75v.375a1.876 1.876 0 0 1 0 3.75v.375c0 3 .75 3.75 3.75 3.75h7.5c3 0 3.75-.75 3.75-3.75a1.876 1.876 0 0 1-1.875-1.875ZM6.75 11.063l4.5-4.5"
      />
      <Path strokeWidth={2} d="M11.246 11.063h.007M6.746 6.938h.007" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
