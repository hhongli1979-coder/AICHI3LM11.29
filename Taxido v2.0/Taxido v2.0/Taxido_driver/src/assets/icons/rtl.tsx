import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={18} height={18}>
    <Path
      d="M16.875 41.747h11.25c9.375 0 13.125-3.743 13.125-13.127V17.38c0-9.384-3.75-13.127-13.125-13.127h-11.25C7.5 4.253 3.75 7.996 3.75 17.38v11.24c0 9.384 3.75 13.127 13.125 13.127Zm0 0"
      style={{
        fill: 'none',
        strokeWidth: 2.8125,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        stroke: color,
        strokeOpacity: 1,
        strokeMiterlimit: 4,
      }}
      transform="scale(.4 .3913)"
    />
    <Path
      d="m32.148 26.414-5.693 5.7M12.842 26.414h19.316M12.842 19.586l5.703-5.7M32.158 19.586H12.842"
      style={{
        fill: 'none',
        strokeWidth: 2.8125,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        stroke: color,
        strokeOpacity: 1,
        strokeMiterlimit: 10,
      }}
      transform="scale(.4 .3913)"
    />
  </Svg>
)
export default SvgComponent
