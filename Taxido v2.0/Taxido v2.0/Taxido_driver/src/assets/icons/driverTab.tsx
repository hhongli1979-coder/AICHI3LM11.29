import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
    <Svg width={25} height={24} fill="none">
        <G stroke={color} strokeMiterlimit={10} strokeWidth={1.5} clipPath="url(#a)">
            <Path d="M20.602 23.297H3.727V19.03a2.812 2.812 0 0 1 2.812-2.812h11.25a2.813 2.813 0 0 1 2.813 2.812v4.266ZM7.945 6.375c-.88-.62-1.406-1.215-1.406-2.11 0-1.941 2.518-3.562 5.625-3.562s5.625 1.621 5.625 3.563c0 .894-.526 1.489-1.406 2.109M16.383 7.078c0 1.553-1.889 2.813-4.219 2.813S7.945 8.63 7.945 7.078" />
            <Path d="M12.164 14.813a4.219 4.219 0 0 1-4.219-4.22V6.376h8.438v4.219a4.219 4.219 0 0 1-4.219 4.219ZM6.715 23.297c.624-2.426 2.827-4.266 5.448-4.266 2.62 0 4.823 1.84 5.447 4.266M6.54 16.219l7.03 7.078" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={color} d="M.164 0h24v24h-24z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
