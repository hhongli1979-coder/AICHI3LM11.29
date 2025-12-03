import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M9.12 8.152a1.363 1.363 0 0 0-.248 0A3.315 3.315 0 0 1 5.67 4.83 3.327 3.327 0 0 1 9 1.5a3.327 3.327 0 0 1 .12 6.652ZM5.37 10.92c-1.816 1.215-1.816 3.195 0 4.402 2.062 1.38 5.444 1.38 7.507 0 1.815-1.214 1.815-3.194 0-4.402-2.055-1.373-5.438-1.373-7.508 0Z"
    />
  </Svg>
)
export default SvgComponent
