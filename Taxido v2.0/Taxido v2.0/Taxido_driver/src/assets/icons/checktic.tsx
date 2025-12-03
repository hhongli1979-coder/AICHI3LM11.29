import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useValues } from '../../utils/context'
import appColors from '../../theme/appColors'
const SvgComponent = () => {
  const { isDark } = useValues()
  return (
    <Svg width={14} height={14} fill="none">
      <Path
        fill={isDark ? appColors.primaryFont : appColors.white}
        d="m12.25 4.083-7 7-3.208-3.208.822-.822 2.386 2.38 6.177-6.172.823.822Z"
      />
    </Svg>
  )
}
export default SvgComponent
