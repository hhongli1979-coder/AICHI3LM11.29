import * as React from "react"
import Svg, { Path,Defs ,G,ClipPath} from 'react-native-svg'

const SvgComponent = () => (
  <Svg
    width={20}
    height={20}
    fill="none"
  >
    <G
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <Path d="M12.986 9.999a2.98 2.98 0 0 1-2.983 2.983A2.98 2.98 0 0 1 7.02 10a2.98 2.98 0 0 1 2.983-2.983 2.98 2.98 0 0 1 2.983 2.983Z" />
      <Path d="M9.998 16.891c2.942 0 5.683-1.733 7.592-4.733.75-1.175.75-3.15 0-4.325-1.909-3-4.65-4.733-7.592-4.733-2.942 0-5.683 1.733-7.592 4.733-.75 1.175-.75 3.15 0 4.325 1.909 3 4.65 4.733 7.592 4.733Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent