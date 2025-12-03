import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
    <Svg width={26} height={26} fill="none">
        <G clipPath="url(#a)">
            <Path
                fill="#1A73E8"
                d="M15.76.432a9.053 9.053 0 0 0-9.706 2.81l4.284 3.597L15.76.432Z"
            />
            <Path
                fill="#EA4335"
                d="M6.056 3.242A9.07 9.07 0 0 0 3.934 9.06c0 1.71.334 3.086.903 4.324l5.502-6.544-4.283-3.597Z"
            />
            <Path
                fill="#4285F4"
                d="M13.008 5.6a3.472 3.472 0 0 1 2.653 5.719s2.73-3.262 5.403-6.426A9.052 9.052 0 0 0 15.759.432l-5.423 6.406A3.524 3.524 0 0 1 13.008 5.6Z"
            />
            <Path
                fill="#FBBC04"
                d="M13.01 12.539a3.472 3.472 0 0 1-3.478-3.478c0-.845.294-1.632.805-2.221l-5.501 6.544c.943 2.083 2.515 3.773 4.126 5.876l6.7-7.96a3.449 3.449 0 0 1-2.653 1.239Z"
            />
            <Path
                fill="#34A853"
                d="M15.543 21.46c3.026-4.737 6.543-6.879 6.543-12.381a9.09 9.09 0 0 0-1.022-4.186L8.961 19.258c.51.669 1.041 1.435 1.552 2.221 1.847 2.85 1.336 4.54 2.515 4.54s.668-1.71 2.515-4.56Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h26v26H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
