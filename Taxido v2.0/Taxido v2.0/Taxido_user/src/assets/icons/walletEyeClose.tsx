import Svg, { Path } from 'react-native-svg';
import React from 'react';

export function WalletEyeClose() {
    return (
        <Svg width={22} height={22} fill="none">
            <Path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.32 8.681 8.68 13.32a3.278 3.278 0 1 1 4.638-4.638Z"
            />
            <Path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.336 5.289c-1.604-1.21-3.438-1.87-5.335-1.87-3.236 0-6.252 1.907-8.351 5.207-.825 1.292-.825 3.465 0 4.757a13.13 13.13 0 0 0 2.484 2.906M7.719 17.903A8.447 8.447 0 0 0 11 18.58c3.236 0 6.252-1.907 8.351-5.207.825-1.292.825-3.464 0-4.757a14.882 14.882 0 0 0-.971-1.347"
            />
            <Path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.218 11.642a3.268 3.268 0 0 1-2.585 2.585M8.68 13.32l-6.848 6.847M20.168 1.833 13.32 8.681"
            />
        </Svg>
    );
}
