import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'

const SvgComponent = ({ color }: any) => (
  <Svg width={14} height={14} fill="none">
    <Path
      stroke={color || "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="m3.5 10.5 7-7M10.5 10.5l-7-7"
    />
  </Svg>
)
export default SvgComponent
