import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'

const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 9a3.75 3.75 0 1 0 0-7.5A3.75 3.75 0 0 0 9 9ZM15.442 16.5c0-2.902-2.888-5.25-6.443-5.25-3.555 0-6.442 2.348-6.442 5.25"
    />
  </Svg>
)
export default SvgComponent
