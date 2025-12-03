import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import SvgComponentProps from './type'
const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
    <Svg width={18} height={18} fill="none">
        <G
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.2}
            clipPath="url(#a)"
        >
            <Path d="M7.945 9.463v1.26c0 .582.473 1.054 1.055 1.054m0 0c.582 0 1.055-.472 1.055-1.054v-1.26M9 11.777l-1.406 5.696h2.812L9 11.777ZM6.187 3.49c-.652-.315-1.054-.737-1.054-1.204C5.133 1.315 6.864.527 9 .527s3.867.787 3.867 1.758c0 .467-.402.89-1.055 1.204m-5.624 0h5.625m-5.626 0a2.11 2.11 0 0 0 2.11 2.11h1.406a2.11 2.11 0 0 0 2.11-2.11" />
            <Path d="m7.945 10.723-3.012.602a2.812 2.812 0 0 0-2.261 2.758v3.39h12.656v-3.39c0-1.34-.946-2.495-2.26-2.758l-3.013-.602M6.188 3.489v3.367a2.812 2.812 0 1 0 5.625 0V3.489" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={color} d="M0 0h18v18H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
