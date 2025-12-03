import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'
const SvgComponent = () => (
  <Svg width={15} height={18} fill="none">
    <Path
      stroke={appColors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="m1 17 6.43-6.586a2.04 2.04 0 0 0 0-2.828L1 1"
      opacity={0.5}
    />
    <Path
      stroke={appColors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="m7 17 6.43-6.586a2.04 2.04 0 0 0 0-2.828L7 1"
    />
  </Svg>
)
export default SvgComponent
