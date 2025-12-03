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
      d="M14.294 14.003 12.689 10.8l-1.605 3.203M11.377 13.434h2.64"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M12.69 16.5a3.81 3.81 0 1 1 .002-7.62 3.81 3.81 0 0 1-.001 7.62ZM3.765 1.5h2.94c1.553 0 2.303.75 2.265 2.265v2.94c.038 1.552-.713 2.302-2.265 2.265h-2.94C2.25 9 1.5 8.25 1.5 6.697v-2.94C1.5 2.25 2.25 1.5 3.765 1.5ZM6.758 4.389H3.713M5.227 3.879v.51"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M5.993 4.38c0 1.313-1.028 2.378-2.288 2.378"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M6.757 6.758c-.548 0-1.043-.293-1.388-.758M1.5 11.25a5.246 5.246 0 0 0 5.25 5.25l-.787-1.313M16.5 6.749a5.246 5.246 0 0 0-5.25-5.25l.787 1.313"
    />
  </Svg>
)
export default SvgComponent
