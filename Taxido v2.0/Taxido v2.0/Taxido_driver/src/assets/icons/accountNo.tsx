import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'

const SvgComponent = () => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M6.056 8.784c1.764 0 3.195-1.519 3.195-3.392S7.82 2 6.056 2C4.292 2 2.86 3.519 2.86 5.392s1.43 3.392 3.195 3.392Z"
    />
    <Path
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M11.48 8.425V6.83c0-1.192.912-2.158 2.038-2.158 1.125 0 2.038.966 2.038 2.158v1.595m-2.668 3.894.453.52.806-1.04m-4.112-1.362c-.99-1.082-2.153-1.653-3.441-1.653H5.518C3.023 8.784 1 10.925 1 13.567v.007h9.035v-3.137Z"
    />
    <Path
      stroke={appColors.secondaryFont}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M17 10.559v-.266c0-1.032-.79-1.868-1.764-1.868H11.8c-.975 0-1.765.836-1.765 1.868v3.839c0 1.032.79 1.868 1.765 1.868h3.436c.97 0 1.757-.828 1.765-1.852"
    />
  </Svg>
)
export default SvgComponent
