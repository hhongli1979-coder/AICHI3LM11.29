import * as React from 'react'
import Svg, {
    Path,
    Defs,
    RadialGradient,
    Stop,
    LinearGradient,
} from "react-native-svg"

const SvgComponent = () => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none">
        <Path
            fill="url(#a)"
            d="M4.422 19.755c.37 3.143 5.686 3.63 6.016 2.028-.008-.01-.013-17.217-.013-17.217-.091-1.168-.665-1.828-1.565-2.45C8.022 1.539 6.97.836 6.398.43 4.783-.718 4.424.79 4.422.836c0 0 .008 18.952 0 18.919Z"
        />
        <Path
            fill="url(#b)"
            d="M10.438 21.138c-2.444 1.841-5.513 1.084-5.955-1.117-.02-.107-.061-.264-.061-.264s.023.216.05.421c.031.216.095.529.16.795.763 2.991 3.357 4.723 5.854 4.992 3.42.302 6.573-2.333 9.154-4.243.16-.157.391-.411.46-.51 1.681-2.412-.346-5.002-1.842-4.9-2.61 1.6-5.217 3.21-7.817 4.826h-.003Z"
        />
        <Path
            fill="url(#c)"
            fillRule="evenodd"
            d="M12.366 9.667c.188 1.193.88 2.76 1.514 4.382.514 1.049 1.576 1.356 2.617 1.663 1.078.32 1.667.533 2.175.785 3.519 1.744.978 5.273 1.514 4.606 2.261-2.811 2.025-8.262-2.286-10.616-1.464-.729-2.932-1.691-3.976-2.123-1.042-.431-1.746.11-1.558 1.303Z"
            clipRule="evenodd"
        />
        <Defs>
            <RadialGradient
                id="b"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(13.36337 -5.72305 9.53364 22.26114 6.678 23.228)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#00BBEC" />
                <Stop offset={1} stopColor="#2756A9" />
            </RadialGradient>
            <RadialGradient
                id="c"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="rotate(-131.008 14.705 4.365) scale(13.4353 9.66975)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#00CACC" />
                <Stop offset={1} stopColor="#048FCE" />
            </RadialGradient>
            <LinearGradient
                id="a"
                x1={7.43}
                x2={7.43}
                y1={-0.007}
                y2={22.449}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#00BBEC" />
                <Stop offset={1} stopColor="#2756A9" />
            </LinearGradient>
        </Defs>
    </Svg>

)
export default SvgComponent
