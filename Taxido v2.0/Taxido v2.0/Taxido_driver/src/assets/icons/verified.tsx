import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none">
    <Path
      fill="#20B149"
      d="M14.519 6.75V4.98a1.5 1.5 0 0 0-1.5-1.5h-1.733l-1.23-1.23a1.5 1.5 0 0 0-2.115 0L6.75 3.48h-1.77a1.5 1.5 0 0 0-1.5 1.5v1.77l-1.23 1.192a1.5 1.5 0 0 0 0 2.115l1.23 1.23v1.733a1.5 1.5 0 0 0 1.5 1.5h1.77l1.192 1.23a1.5 1.5 0 0 0 2.115 0l1.23-1.23h1.733a1.5 1.5 0 0 0 1.5-1.5v-1.733l1.23-1.23a1.5 1.5 0 0 0 0-2.115l-1.23-1.192Z"
    />
    <Path
      fill="#fff"
      d="M8.435 10.874a.75.75 0 0 1-.532-.217L6.748 9.532a.753.753 0 1 1 1.065-1.065l.592.6 1.718-1.725a.774.774 0 1 1 1.125 1.065l-2.25 2.25a.751.751 0 0 1-.563.217Z"
    />
  </Svg>
)
export default SvgComponent
