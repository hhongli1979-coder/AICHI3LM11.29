import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke="#FF4B4B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M15.75 4.485a76.276 76.276 0 0 0-7.515-.375c-1.485 0-2.97.075-4.455.225l-1.53.15M6.375 3.728l.165-.983c.12-.712.21-1.245 1.478-1.245h1.964c1.268 0 1.366.563 1.478 1.252l.165.976M14.137 6.854l-.487 7.553c-.082 1.178-.15 2.093-2.242 2.093H6.593c-2.093 0-2.16-.915-2.243-2.093l-.487-7.553M7.747 12.375h2.498M7.125 9.375h3.75"
    />
  </Svg>
)
export default SvgComponent
