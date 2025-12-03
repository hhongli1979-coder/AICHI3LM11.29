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
      d="M1.522 9.315c.27 3.863 3.548 7.005 7.47 7.178a7.882 7.882 0 0 0 6.728-3.203c.615-.832.285-1.387-.743-1.2a7.12 7.12 0 0 1-1.56.105c-3.667-.15-6.667-3.217-6.682-6.84a6.672 6.672 0 0 1 .562-2.737c.405-.93-.082-1.373-1.02-.975-2.97 1.252-5.002 4.245-4.755 7.672Z"
    />
  </Svg>
)
export default SvgComponent
