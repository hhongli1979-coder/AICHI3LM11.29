import * as React from 'react'
import Svg, { Path } from "react-native-svg"

const SvgComponent = ({ color }) => (
    <Svg width={18} height={18} fill="none">
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.2}
            d="M7.582 8.361H5.595a.855.855 0 0 0-.855.855v3.84h2.842V8.361v0Z"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.2}
            d="M9.57 4.95H8.43a.855.855 0 0 0-.854.854v7.245h2.842V5.804a.848.848 0 0 0-.847-.855ZM12.411 9.637h-1.987v3.412h2.842v-2.557a.864.864 0 0 0-.855-.855Z"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M6.75 16.5h4.5c3.75 0 5.25-1.5 5.25-5.25v-4.5C16.5 3 15 1.5 11.25 1.5h-4.5C3 1.5 1.5 3 1.5 6.75v4.5C1.5 15 3 16.5 6.75 16.5Z"
        />
    </Svg>
)
export default SvgComponent
