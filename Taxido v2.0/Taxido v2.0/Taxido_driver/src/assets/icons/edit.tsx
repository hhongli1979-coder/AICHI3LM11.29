import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke={ color }
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M8.25 1.5h-1.5C3 1.5 1.5 3 1.5 6.75v4.5C1.5 15 3 16.5 6.75 16.5h4.5c3.75 0 5.25-1.5 5.25-5.25v-1.5"
    />
    <Path
      stroke={ color }
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="m12.028 2.266-5.91 5.91c-.225.225-.45.667-.495.99l-.322 2.257c-.12.818.457 1.388 1.275 1.275l2.257-.322c.315-.045.758-.27.99-.495l5.91-5.91c1.02-1.02 1.5-2.205 0-3.705s-2.685-1.02-3.705 0Z"
    />
    <Path
      stroke={ color }
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M11.184 3.113a5.358 5.358 0 0 0 3.705 3.705"
    />
  </Svg>
)
export default SvgComponent
