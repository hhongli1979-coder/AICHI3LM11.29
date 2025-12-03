import Svg, { Path } from 'react-native-svg';
import React from 'react';

export function LiveShare() {
    return (
        <Svg width={22} height={22} fill="none">
            <Path
                fill="#777"
                stroke="#777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="m13.443 5.023 3.64 3.236c1.439 1.279 2.158 1.918 2.158 2.74 0 .824-.72 1.463-2.157 2.741l-3.641 3.237c-.657.584-.985.875-1.255.754-.271-.122-.271-.56-.271-1.439v-2.15c-3.3 0-6.875 1.572-8.25 4.191 0-8.38 4.889-10.476 8.25-10.476v-2.15c0-.877 0-1.316.27-1.438.271-.121.6.17 1.256.754Z"
            />
        </Svg>
    );
}
