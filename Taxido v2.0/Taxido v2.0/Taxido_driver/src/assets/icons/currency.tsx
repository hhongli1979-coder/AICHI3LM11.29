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
      d="M14.476 5.94v3.863c0 2.31-1.32 3.3-3.3 3.3H4.583c-.337 0-.66-.03-.96-.098a2.916 2.916 0 0 1-.532-.142c-1.125-.42-1.808-1.395-1.808-3.06V5.94c0-2.31 1.32-3.3 3.3-3.3h6.593c1.68 0 2.887.713 3.21 2.34.052.3.09.608.09.96Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M16.726 8.19v3.863c0 2.31-1.32 3.3-3.3 3.3H6.833c-.555 0-1.057-.075-1.492-.24-.893-.33-1.5-1.012-1.718-2.107.3.067.623.097.96.097h6.593c1.98 0 3.3-.99 3.3-3.3V5.94c0-.352-.03-.667-.09-.96 1.425.3 2.34 1.305 2.34 3.21Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M7.875 9.855a1.98 1.98 0 1 0 0-3.96 1.98 1.98 0 0 0 0 3.96ZM3.586 6.225v3.3M12.166 6.225v3.3"
    />
  </Svg>
)
export default SvgComponent
