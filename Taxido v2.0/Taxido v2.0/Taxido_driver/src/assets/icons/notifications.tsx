import React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'

const SvgComponent = ({ color = appColors.white }) => (
  <Svg width={20} height={22} fill="none" viewBox="0 0 64 64">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M34.85 6.056c-10.438 0-18.92 8.483-18.92 18.92v9.113c0 1.924-.82 4.856-1.798 6.496l-3.627 6.023c-2.238 3.721-.693 7.852 3.406 9.24a65.971 65.971 0 0 0 41.845 0c3.815-1.262 5.487-5.771 3.405-9.24l-3.626-6.023c-.946-1.64-1.766-4.572-1.766-6.496v-9.113c0-10.406-8.514-18.92-18.92-18.92Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M40.67 6.969a19.09 19.09 0 0 0-3.028-.63c-3.027-.38-5.928-.159-8.64.63a6.26 6.26 0 0 1 5.834-3.973 6.26 6.26 0 0 1 5.833 3.973Z"
    />
    <Path
      stroke={color}
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M44.307 56.984c0 5.203-4.257 9.46-9.46 9.46a9.494 9.494 0 0 1-6.685-2.775 9.493 9.493 0 0 1-2.775-6.685"
    />
  </Svg>
)

export default SvgComponent
