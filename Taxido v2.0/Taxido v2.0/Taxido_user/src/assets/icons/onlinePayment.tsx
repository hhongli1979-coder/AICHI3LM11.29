import Svg, { Path } from 'react-native-svg';
import React from 'react';
import SvgComponentProps from './type';

export function OnlinePayment({ colors }: SvgComponentProps) {
    return (
        <Svg width={20} height={20} fill="none">
            <Path
                stroke={colors}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                d="M16.094 10H.78m9.063 4.688h3.125m3.125 1.562c0 .863-.7 1.563-1.563 1.563H2.344c-.863 0-1.563-.7-1.563-1.563V8.437c0-.862.7-1.562 1.563-1.562H14.53c.863 0 1.563.7 1.563 1.563v7.812Z"
            />
            <Path
                stroke={colors}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                d="M3.906 6.875V3.75c0-.863.7-1.563 1.563-1.563h12.187c.863 0 1.563.7 1.563 1.563v7.813c0 .862-.7 1.562-1.563 1.562h-1.562"
            />
        </Svg>
    );
}
