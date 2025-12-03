import * as React from "react"
import Svg, { Path } from "react-native-svg"
import SvgComponentProps from "./type"

export function ShareTrip({ color }: SvgComponentProps) {
    return (
        <Svg width={20} height={20} fill="none">
            <Path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="m9.777 3.653 2.648 2.354C13.47 6.937 13.993 7.4 13.993 8c0 .599-.523 1.064-1.568 1.993l-2.648 2.354c-.478.424-.716.636-.913.548-.197-.088-.197-.408-.197-1.046v-1.563c-2.4 0-5 1.143-6 3.047 0-6.095 3.556-7.619 6-7.619V4.151c0-.638 0-.958.197-1.046.197-.089.435.124.913.548Z"
            />
        </Svg>
    )
}