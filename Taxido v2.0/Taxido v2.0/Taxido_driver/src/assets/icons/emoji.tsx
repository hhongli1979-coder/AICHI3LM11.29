import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'
const SvgComponent = () => (
  <Svg width={22} height={22} fill="none">
    <Path
      fill={appColors.secondaryFont}
      d="M11 .6a10.4 10.4 0 1 1 0 20.8A10.4 10.4 0 0 1 11 .6Zm0 1.3a9.1 9.1 0 1 0 0 18.2 9.1 9.1 0 0 0 0-18.2ZM7.3 14.155a5.214 5.214 0 0 0 7.166.221l.231-.22a.65.65 0 0 1 .997.826l-.074.091-.03.029a6.514 6.514 0 0 1-9.213-.03.65.65 0 0 1 .923-.917ZM14.25 7.75a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm-6.5 0a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z"
    />
  </Svg>
)
export default SvgComponent
