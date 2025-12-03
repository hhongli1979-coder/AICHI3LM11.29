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
      d="m2.993 10.995-1.14-1.14a1.204 1.204 0 0 1 0-1.695l1.14-1.14c.195-.195.352-.577.352-.847V4.56c0-.66.54-1.2 1.2-1.2h1.613c.27 0 .652-.157.847-.352l1.14-1.14a1.204 1.204 0 0 1 1.695 0l1.14 1.14c.195.195.578.352.848.352h1.612c.66 0 1.2.54 1.2 1.2v1.613c0 .27.158.652.353.847l1.14 1.14c.465.465.465 1.23 0 1.695l-1.14 1.14a1.384 1.384 0 0 0-.353.848v1.612c0 .66-.54 1.2-1.2 1.2h-1.612c-.27 0-.653.158-.848.353l-1.14 1.14a1.204 1.204 0 0 1-1.695 0l-1.14-1.14a1.384 1.384 0 0 0-.847-.353H4.545c-.66 0-1.2-.54-1.2-1.2v-1.612c0-.278-.157-.66-.352-.848Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m6.75 11.25 4.5-4.5"
    />
    <Path
      stroke="#1F1F1F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.87 10.875h.008M7.12 7.125h.008"
    />
  </Svg>
)
export default SvgComponent
