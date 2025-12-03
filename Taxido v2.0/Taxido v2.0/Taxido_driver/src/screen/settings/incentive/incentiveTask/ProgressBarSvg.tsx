import * as React from "react"
import Svg, {
    Mask,
    Rect,
    G,
    Path,
    Defs,
    LinearGradient,
    Stop,
} from "react-native-svg"

interface ProgressBarSvgProps {
    width: number;
    height?: number;
}

const ProgressBarSvg = ({ width, height = 10 }: ProgressBarSvgProps) => (
    <Svg width={width} height={height} fill="none">
        <Mask
            id="b"
            width={width}
            height={height}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "alpha",
            }}
        >
            <Rect width={width} height={height} fill="url(#a)" rx={5} />
        </Mask>
        <G mask="url(#b)">
            <Rect width={width} height={height} fill="#199675" rx={5} />
            <Path
                fill="#fff"
                d="M45.066-1.929 34.38-9-8.146 19.143l10.685 7.07L45.066-1.928ZM87.696-1.929 77.01-9 34.484 19.143l10.685 7.07L87.696-1.928ZM130.326-1.929 119.641-9 77.114 19.143l10.685 7.07 42.527-28.142ZM172.956-1.929 162.271-9l-42.527 28.143 10.685 7.07 42.527-28.142ZM215.585-1.929 204.9-9l-42.526 28.143 10.685 7.07 42.526-28.142ZM258.215-1.929 247.53-9l-42.526 28.143 10.685 7.07 42.526-28.142ZM300.845-1.929 290.16-9l-42.527 28.143 10.685 7.07 42.527-28.142Z"
                opacity={0.21}
            />
            <Path
                fill="#199675"
                d="M270.489 1.9c0 2.2-.949 4.3-2.531 5.7a8.685 8.685 0 0 1-6.01 2.4H10.052c-4.745 0-8.54-3.6-8.54-8.1 0-.3 0-.6.105-.9.527 4 4.112 7.2 8.54 7.2h251.897c2.32 0 4.534-.9 6.01-2.4 1.371-1.3 2.214-2.9 2.425-4.8-.105.3 0 .6 0 .9Z"
                opacity={0.53}
            />
            <Path
                fill="#fff"
                d="M280.696 6H12.459c-1.058 0-1.881-.875-1.881-2s.823-2 1.881-2h268.237c1.058 0 1.882.875 1.882 2 0 1-.824 2-1.882 2Z"
                opacity={0.21}
            />
        </G>
        <Defs>
            <LinearGradient
                id="a"
                x1={width / 2}
                x2={width / 2 + 0.709}
                y1={-2.51}
                y2={11.001}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#76DB76" />
                <Stop offset={0.997} stopColor="#1E9F76" />
            </LinearGradient>
        </Defs>
    </Svg>
)

export default ProgressBarSvg
