import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={20} height={20} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="m12.5 16.6-5.433-5.433a1.655 1.655 0 0 1 0-2.334L12.501 3.4"
    />
  </Svg>
)
export default SvgComponent
