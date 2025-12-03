import Svg, { Path } from "react-native-svg"
import React from 'react';

export function IdCard() {
    return (
        <Svg
            width={20}
            height={20}
            fill="none"
        >
            <Path
                stroke="#777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M14.168 17.5H5.835c-3.334 0-4.167-.833-4.167-4.167V6.667c0-3.334.833-4.167 4.167-4.167h8.333c3.333 0 4.167.833 4.167 4.167v6.666c0 3.334-.834 4.167-4.167 4.167ZM11.668 6.667h4.167M12.5 10h3.333M14.168 13.334h1.667"
            />
            <Path
                stroke="#777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M7.083 9.408a1.508 1.508 0 1 0 0-3.016 1.508 1.508 0 0 0 0 3.016ZM10.001 13.608a2.517 2.517 0 0 0-2.283-2.266 6.428 6.428 0 0 0-1.267 0 2.524 2.524 0 0 0-2.283 2.266"
            />
        </Svg>
    );
}
