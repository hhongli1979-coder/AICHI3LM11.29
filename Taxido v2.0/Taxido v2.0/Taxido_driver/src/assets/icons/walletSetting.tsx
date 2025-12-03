import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={18} height={18} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M13.53 10.162c-.315.308-.495.75-.45 1.223.068.81.81 1.402 1.62 1.402h1.425v.893a2.826 2.826 0 0 1-2.82 2.82h-8.61a2.826 2.826 0 0 1-2.82-2.82V8.633a2.826 2.826 0 0 1 2.82-2.82h8.61a2.826 2.826 0 0 1 2.82 2.82v1.08H14.61c-.42 0-.803.164-1.08.45Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M1.875 9.307V5.88c0-.892.547-1.688 1.38-2.003l5.955-2.25a1.425 1.425 0 0 1 1.927 1.336v2.85M16.92 10.478v1.545a.77.77 0 0 1-.75.765H14.7c-.81 0-1.553-.593-1.62-1.403a1.506 1.506 0 0 1 .45-1.222c.277-.285.66-.45 1.08-.45h1.56a.77.77 0 0 1 .75.765ZM5.25 9h5.25"
    />
  </Svg>
)
export default SvgComponent
