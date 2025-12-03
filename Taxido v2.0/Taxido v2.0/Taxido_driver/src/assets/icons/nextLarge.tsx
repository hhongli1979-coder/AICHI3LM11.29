import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = ({ color }) => (
  <Svg width={16} height={16} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="m5.941 13.28 4.347-4.346a1.324 1.324 0 0 0 0-1.867L5.941 2.721"
    />
  </Svg>
)
export default SvgComponent
