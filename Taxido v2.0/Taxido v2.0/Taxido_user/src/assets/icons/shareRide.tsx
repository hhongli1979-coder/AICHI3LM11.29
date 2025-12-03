import * as React from "react"
import Svg, { Path } from "react-native-svg"
import SvgComponentProps from "./type"

export function ShareRide(props: SvgComponentProps) {
    return (
        <Svg
            width={20}
            height={20}
            fill="none"
            {...props}
        >
            <Path
                stroke="#199675"
                strokeMiterlimit={2.613}
                strokeWidth={1.5}
                d="m12.4 14.625-4.896-2.826m0-2.736 4.895-2.826M16.705 6.803a2.735 2.735 0 1 0-3.868-3.869 2.735 2.735 0 0 0 3.868 3.869ZM17.49 16.291a2.735 2.735 0 1 0-5.438-.596 2.735 2.735 0 0 0 5.439.596ZM7.838 10.869a2.735 2.735 0 1 0-5.4-.877 2.735 2.735 0 0 0 5.4.877Z"
            />
        </Svg>
    )
}