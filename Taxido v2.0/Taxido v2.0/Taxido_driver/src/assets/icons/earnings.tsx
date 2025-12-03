import * as React from 'react'
import Svg, { Path } from "react-native-svg"
import appColors from '../../theme/appColors'
const SvgComponent = () => (
    <Svg width={28} height={28} fill="none">
        <Path
            fill={appColors.blueShade}
            fillRule="evenodd"
            d="M21.032 8.47a8.32 8.32 0 0 1 5.218 7.717 8.317 8.317 0 0 1-8.313 8.313 8.266 8.266 0 0 1-4.314-1.207c4.74-1.198 8.252-5.495 8.252-10.605 0-1.495-.3-2.92-.843-4.217ZM10.937 3.5c5.071 0 9.188 4.117 9.188 9.188 0 5.07-4.117 9.187-9.188 9.187-5.07 0-9.187-4.117-9.187-9.188 0-5.07 4.117-9.187 9.188-9.187Zm.752 3.835a.875.875 0 0 0-1.503 0L8.74 9.76l-2.752.625a.874.874 0 0 0-.464 1.43l1.858 2.123-.255 2.81a.875.875 0 0 0 1.216.884l2.594-1.111 2.593 1.111a.874.874 0 0 0 1.216-.884l-.255-2.81 1.858-2.123a.876.876 0 0 0-.464-1.43l-2.752-.625-1.445-2.424Z"
            clipRule="evenodd"
        />
    </Svg>
)
export default SvgComponent
