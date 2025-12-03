import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import SvgComponentProps from './type'
import appColors from '../../theme/appColors'

const SvgComponent: React.FC<SvgComponentProps> = () => (

  <Svg width={20} height={20} fill="none">
    <G stroke={appColors.secondaryFont} strokeWidth={1.2} clipPath="url(#a)">
      <Path d="M9.78 14.883a.181.181 0 1 0 .362 0 .181.181 0 0 0-.362 0Z" />
      <Path
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M9.96 12.148v-1.126c0-.322.227-.6.545-.67 1.15-.252 2.001-1.286 1.954-2.508-.05-1.281-1.105-2.325-2.4-2.373C8.632 5.417 7.46 6.533 7.46 7.93"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M14.77 17.89A9.219 9.219 0 1 1 19.22 10a9.186 9.186 0 0 1-1.564 5.117"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={appColors.white} d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
