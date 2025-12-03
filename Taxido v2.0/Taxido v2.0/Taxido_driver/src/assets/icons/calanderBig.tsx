import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import appColors from '../../theme/appColors'

const Calander = () => (
  <Svg width={18} height={18} fill="none">
    <G stroke={appColors.secondaryFont} clipPath="url(#a)">
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M6 1.5v2.25M12 1.5v2.25M12 2.625c2.498.135 3.75 1.087 3.75 4.612v4.636c0 3.09-.75 4.635-4.5 4.635h-4.5c-3.75 0-4.5-1.545-4.5-4.635V7.238c0-3.526 1.252-4.47 3.75-4.613h6ZM15.563 13.2H2.437"
      />
      <Path
        fill={appColors.secondaryFont}
        d="M10.355 9.803c0-.03 0-.057-.003-.085a.91.91 0 0 1 .023.204c0 .324-.12.554-.318.713-.057.046-.125.09-.203.127a1.128 1.128 0 0 0 .5-.96Zm-2.275.912.074.053a1.071 1.071 0 0 1-.214-.132c-.197-.159-.315-.388-.315-.713 0-.07.008-.139.023-.204a1.128 1.128 0 0 0 .432.996Zm2.115-3.05c0 .095-.013.18-.038.257a1.16 1.16 0 0 0 .018-.204 1.05 1.05 0 0 0-.378-.827c.03.019.058.039.084.06.186.15.314.373.314.714Zm-2.37.053c0 .083.009.165.026.243a.793.793 0 0 1-.053-.296c0-.34.128-.563.317-.713a.97.97 0 0 1 .097-.069l-.018.015a1.05 1.05 0 0 0-.369.82Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Calander
