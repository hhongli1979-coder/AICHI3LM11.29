import * as React from "react"
import Svg, { Path } from "react-native-svg"
import SvgComponentProps from "./type"
import appColors from "../../theme/appColors"

const SvgComponent: React.FC<SvgComponentProps> = ({ color }: any) => (
  <Svg
    width={20}
    height={20}
    fill="none"
  >
    <Path
      stroke={color || appColors.primaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="m7.5 16.6 5.433-5.433a1.655 1.655 0 0 0 0-2.334L7.499 3.4"
    />
  </Svg>
)
export default SvgComponent
