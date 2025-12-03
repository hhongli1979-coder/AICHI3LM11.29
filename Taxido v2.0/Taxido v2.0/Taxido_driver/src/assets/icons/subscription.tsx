import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = ({ color }) => (
  <Svg height={18} width={18} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1.5 11.468V4.283c0-.998.578-1.238 1.283-.533l1.942 1.943a.747.747 0 0 0 1.058 0L8.466 3a.747.747 0 0 1 1.058 0l2.692 2.693a.747.747 0 0 0 1.058 0l1.942-1.943c.705-.705 1.283-.465 1.283.533v7.192c0 2.25-1.5 3.75-3.75 3.75h-7.5a3.763 3.763 0 0 1-3.75-3.757Z"
    />
  </Svg>
)
export default SvgComponent
