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
      clipPath="url(#a)"
    >
      <Path d="M9.001 1c4.372 0 7.954 3.554 8 7.914.011.96-.643 1.853-1.585 2.04-.8.157-1.392-.195-1.654-.31-1.317-.574-2.647.783-2.046 2.088.218.472.316 1.01.256 1.575-.167 1.578-1.634 2.74-3.22 2.691C4.465 16.867 1 13.319 1 9.002 1 4.701 4.585 1 9.001 1Z" />
      <Path d="M13.98 6.013c0 .55-.357.996-.996.996a.996.996 0 1 1 .996-.996ZM9.998 4.021a.996.996 0 1 1-1.992 0 .996.996 0 0 1 1.992 0ZM6.013 6.013a.996.996 0 1 1-1.992 0 .996.996 0 0 1 1.992 0ZM6.013 10.495a1.494 1.494 0 1 1-2.988 0 1.494 1.494 0 0 1 2.988 0ZM9.998 13.483a1.494 1.494 0 1 1-2.988 0 1.494 1.494 0 0 1 2.988 0Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
