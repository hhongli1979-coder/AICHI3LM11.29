import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={15} height={15} fill="none">
    <Path
      stroke={color}
      strokeWidth={1.2}
      d="M5.131 4.219A2.371 2.371 0 0 1 7.5 1.85a2.371 2.371 0 0 1 2.369 2.368A2.361 2.361 0 0 1 7.598 6.58a1.114 1.114 0 0 0-.19 0c-1.3-.064-2.277-1.096-2.277-2.362ZM4.66 12.37h-.003c-.666-.445-.957-.989-.957-1.507 0-.52.292-1.07.963-1.52.76-.502 1.788-.771 2.844-.771 1.057 0 2.082.269 2.835.771.662.441.952.985.958 1.51-.001.524-.294 1.068-.96 1.518-.756.507-1.783.779-2.84.779-1.058 0-2.085-.272-2.84-.78Z"
    />
  </Svg>
)
export default SvgComponent
