import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={20} height={20} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M10.018 1.667a5.504 5.504 0 0 0-5.5 5.5v2.65c0 .559-.238 1.411-.522 1.888l-1.054 1.75c-.651 1.082-.202 2.283.99 2.687a19.178 19.178 0 0 0 12.164 0 1.835 1.835 0 0 0 .99-2.686l-1.054-1.751c-.275-.477-.514-1.33-.514-1.888v-2.65c0-3.025-2.475-5.5-5.5-5.5Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M11.714 1.933a6.191 6.191 0 0 0-3.392 0A1.82 1.82 0 0 1 10.018.778c.77 0 1.43.476 1.696 1.155Z"
    />
    <Path
      stroke={color}
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M12.769 16.472a2.758 2.758 0 0 1-2.75 2.75 2.76 2.76 0 0 1-1.944-.806 2.76 2.76 0 0 1-.806-1.944"
    />
  </Svg>
)
export default SvgComponent
