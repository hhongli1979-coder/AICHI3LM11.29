import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke="#FF4B4B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M13.08 10.965 15 9.045l-1.92-1.92M7.32 9.045h7.627M8.82 15c-3.315 0-6-2.25-6-6s2.685-6 6-6"
    />
  </Svg>
)
export default SvgComponent
