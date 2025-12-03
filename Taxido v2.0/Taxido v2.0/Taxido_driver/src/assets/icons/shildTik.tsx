import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = ({ background, tik }) => (
  <Svg height={24} width={24} fill="none">
    <Path
      fill={background}
      d="m12 2.625 7.875 3v7.5c0 3.375-3 6.75-7.875 8.25-4.875-1.5-7.875-4.5-7.875-8.25v-7.5l7.875-3Z"
    />
    <Path
      stroke={tik}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m8.625 11.625 2.25 2.25 4.5-5.25"
    />
  </Svg>
)
export default SvgComponent
