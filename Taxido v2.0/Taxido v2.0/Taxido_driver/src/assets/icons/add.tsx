import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = ({ color }) => (
  <Svg width={20} height={20} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M5 10h10M10 15V5"
    />
  </Svg>
)
export default SvgComponent
