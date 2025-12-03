import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { appColors } from "@src/themes"

export function Remove() {
    return (
        <Svg width={20} height={20} fill="none">
            <Path
                fill={appColors.primary}
                d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0ZM2.49 10a7.51 7.51 0 0 1 11.869-6.117L3.883 14.359A7.476 7.476 0 0 1 2.489 10ZM10 17.51a7.477 7.477 0 0 1-4.357-1.391L16.12 5.643A7.51 7.51 0 0 1 10 17.511Z"
            />
        </Svg>
    )

}