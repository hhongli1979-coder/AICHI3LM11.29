import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'

const SvgComponent = () => (
  <Svg width={11} height={8} fill="none">
    <Path
      fill={appColors.secondaryFont}
      d="M1 3.5a.5.5 0 0 0 0 1v-1Zm9.354.854a.5.5 0 0 0 0-.708L7.172.464a.5.5 0 1 0-.708.708L9.293 4 6.464 6.828a.5.5 0 1 0 .708.708l3.182-3.182ZM1 4.5h9v-1H1v1Z"
    />
  </Svg>
)
export default SvgComponent
