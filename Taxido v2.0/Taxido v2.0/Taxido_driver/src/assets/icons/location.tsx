import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={12} height={12} fill="none">
    <G clipPath="url(#a)">
      <Path
        fill={color}
        d="M10.31 4.225C9.787 1.915 7.77.875 6 .875h-.004C4.23.875 2.21 1.91 1.686 4.22 1.1 6.8 2.68 8.985 4.11 10.36c.53.51 1.21.765 1.89.765.68 0 1.36-.255 1.885-.765 1.43-1.375 3.01-3.555 2.424-6.135ZM6 6.73a1.575 1.575 0 1 1 0-3.15 1.575 1.575 0 0 1 0 3.15Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
