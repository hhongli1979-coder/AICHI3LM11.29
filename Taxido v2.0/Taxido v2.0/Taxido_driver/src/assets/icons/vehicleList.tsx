import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={19} height={18} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={22.926}
      strokeWidth={1.2}
      d="M16.028 7.32c-.707-1.153-1.413-2.305-2.118-3.458a2.058 2.058 0 0 0-1.8-1.007H6.494c-.755 0-1.404.363-1.799 1.007L2.588 7.3M17.072 13.366v1.086a.85.85 0 0 1-.848.848h-1.573a.85.85 0 0 1-.848-.848v-1.05M4.803 13.366v1.086a.85.85 0 0 1-.848.848H2.38a.85.85 0 0 1-.848-.848v-1.086"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={22.926}
      strokeWidth={1.2}
      d="M3.12 7.284h12.366c1.222 0 2.219.964 2.219 2.145v2.883c0 .58-.49 1.054-1.091 1.054H1.992C1.39 13.366.9 12.892.9 12.312V9.428c0-1.181.997-2.145 2.22-2.145Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={22.926}
      strokeWidth={1.2}
      d="M1.95 9.274c1.06.07 1.904.957 1.904 2.035v.07H.9v-1.123c0-.282.106-.525.312-.718a.952.952 0 0 1 .737-.264ZM16.656 9.274a2.043 2.043 0 0 0-1.904 2.035v.07h2.953v-1.123a.952.952 0 0 0-.311-.718.952.952 0 0 0-.738-.264ZM5.225 9.253h8.156c-.235.51-.47 1.02-.703 1.53a1.035 1.035 0 0 1-.959.615H6.885c-.422 0-.783-.232-.959-.615l-.701-1.53Z"
    />
  </Svg>
)
export default SvgComponent
