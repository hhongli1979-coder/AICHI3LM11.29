import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke="#1F1F1F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m14.94 6.713-4.89 4.89a1.49 1.49 0 0 1-2.1 0l-4.89-4.89"
    />
  </Svg>
)
export default SvgComponent
