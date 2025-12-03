import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'
const Calander = () => (
  <Svg height={24} width={24} fill="none">
    <Path
      stroke={appColors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
    />
    <Path
      stroke={appColors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.695 13.7h.009M15.695 16.7h.009M11.995 13.7h.01M11.995 16.7h.01M8.294 13.7h.01M8.294 16.7h.01"
    />
  </Svg>
)
export default Calander
