import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={12} height={12} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M6 9.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M6 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6 2V1M2 6H1M6 10v1M10 6h1"
    />
  </Svg>
)
export default SvgComponent
