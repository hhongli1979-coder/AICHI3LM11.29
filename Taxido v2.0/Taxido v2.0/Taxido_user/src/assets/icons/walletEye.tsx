import Svg, { Path } from 'react-native-svg';
import React from 'react';

export function WalletEye() {
    return (
        <Svg width={24} height={24} fill="none">
            <Path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.582 12c0 1.98-1.6 3.58-3.58 3.58s-3.58-1.6-3.58-3.58 1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z"
            />
            <Path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z"
            />
        </Svg>
    );
}
