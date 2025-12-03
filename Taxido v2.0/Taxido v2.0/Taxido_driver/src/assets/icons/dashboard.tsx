import * as React from "react"
import { SVGProps } from "react"
import Svg, { Path } from "react-native-svg"
import SvgComponentProps from "./type"

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
    <Svg
        width={24}
        height={24}
        fill="none"
    >
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="M17 10h2c2 0 3-1 3-3V5c0-2-1-3-3-3h-2c-2 0-3 1-3 3v2c0 2 1 3 3 3ZM5 22h2c2 0 3-1 3-3v-2c0-2-1-3-3-3H5c-2 0-3 1-3 3v2c0 2 1 3 3 3ZM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        />
    </Svg>
)
export default SvgComponent