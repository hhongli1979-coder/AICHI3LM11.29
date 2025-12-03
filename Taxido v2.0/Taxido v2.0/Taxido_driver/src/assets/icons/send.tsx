import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = () => (
  <Svg width={15} height={15} fill="none">
    <Path
      stroke="#FF4B4B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m3.125 2.188 8.75 8.75M3.125 8.606V2.188h6.419"
    />
  </Svg>
)
export default SvgComponent
