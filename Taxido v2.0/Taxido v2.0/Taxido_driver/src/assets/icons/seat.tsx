import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import appColors from '../../theme/appColors'
const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <G
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={22.926}
      clipPath="url(#a)"
    >
      <Path d="M7.723 1H10.2c1.139 0 2.084.748 2.203 1.743l.656 5.515c.05.423-.09.805-.416 1.122-.324.316-.742.48-1.227.48h-4.91c-.485 0-.903-.164-1.228-.48-.324-.317-.466-.699-.416-1.122l.657-5.515C5.638 1.748 6.584 1 7.723 1ZM8.96 12.637v5.308M4.602 9.86h8.718a1.34 1.34 0 0 1 1.336 1.335 1.34 1.34 0 0 1-1.336 1.336H4.602a1.34 1.34 0 0 1-1.336-1.336A1.34 1.34 0 0 1 4.602 9.86ZM4.32 17.945v-.773c0-.523.427-.95.95-.95h7.382c.523 0 .95.427.95.95v.773M15.922 8.523h-1.266v2.409M2 8.523h1.266v2.409" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
