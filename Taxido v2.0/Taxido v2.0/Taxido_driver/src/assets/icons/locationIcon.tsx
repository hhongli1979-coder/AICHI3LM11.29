
import * as React from "react"
import Svg, { Defs, G, Path, ClipPath } from 'react-native-svg'
import SvgComponentProps from "./type"
import appColors from "../../theme/appColors"

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg
    width={26}
    height={26}
    fill="none"
  >
    <G fill={color} clipPath="url(#a)">
      <Path d="M.448 14.345H2.78a10.32 10.32 0 0 0 8.876 8.876v2.33a.45.45 0 0 0 .448.449h1.794a.45.45 0 0 0 .448-.448V23.22a10.32 10.32 0 0 0 8.876-8.876h2.33a.45.45 0 0 0 .449-.448v-1.794a.45.45 0 0 0-.448-.448H23.22a10.32 10.32 0 0 0-8.876-8.876V.45A.45.45 0 0 0 13.897 0h-1.794a.45.45 0 0 0-.448.448V2.78a10.32 10.32 0 0 0-8.876 8.876H.45a.45.45 0 0 0-.449.448v1.794a.45.45 0 0 0 .448.448ZM13 5.379A7.62 7.62 0 1 1 5.38 13 7.632 7.632 0 0 1 13 5.38Z" />
      <Path d="M16.587 13a3.586 3.586 0 1 1-7.173 0 3.586 3.586 0 0 1 7.173 0Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h26v26H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent