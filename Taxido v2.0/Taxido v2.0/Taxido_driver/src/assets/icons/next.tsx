import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'
const SvgComponent = () => (
  <Svg width={8} height={8} fill="none">
    <Path
      stroke={appColors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.8}
      d="M3.1 6.31 5 4.408a.58.58 0 0 0 0-.816L3.1 1.69"
    />
  </Svg>
)
export default SvgComponent
