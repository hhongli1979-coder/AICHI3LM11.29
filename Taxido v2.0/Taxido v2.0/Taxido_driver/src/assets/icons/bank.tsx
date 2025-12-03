import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="m9.277 1.611 6.75 2.7c.263.105.473.42.473.698v2.49c0 .412-.337.75-.75.75H2.25a.752.752 0 0 1-.75-.75v-2.49c0-.278.21-.593.472-.698l6.75-2.7c.15-.06.405-.06.556 0ZM16.5 16.5h-15v-2.25c0-.412.337-.75.75-.75h13.5c.413 0 .75.338.75.75v2.25ZM3 13.5V8.25M6 13.5V8.25M9 13.5V8.25M12 13.5V8.25M15 13.5V8.25M.75 16.5h16.5"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M9 6.375a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
    />
  </Svg>
)
export default SvgComponent
