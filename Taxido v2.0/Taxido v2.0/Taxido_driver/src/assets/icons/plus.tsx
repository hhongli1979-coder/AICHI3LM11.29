import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgComponent = ({ color }: any) => (
  <Svg width={24} height={24} fill="none">
    <Path
      stroke={color || "#1F1F1F"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 12h12M12 18V6"
    />
  </Svg>
)
export default SvgComponent
