import * as React from 'react'
import Svg, { Path} from 'react-native-svg'
const SvgComponent = () => (
    <Svg
        xmlns="http://www.w3.org/2000/Svg"
        width={26}
        height={26}
        fill="none"
    >
        <Path
            fill="#fff"
            d="M12.999 1.084a11.917 11.917 0 1 0 11.916 11.917A11.924 11.924 0 0 0 13 1.084Zm-1.084 4.333a1.083 1.083 0 1 1 2.167 0v4.334a1.083 1.083 0 1 1-2.167 0V5.417ZM13 20.584A7.58 7.58 0 0 1 8.816 6.68a1.083 1.083 0 1 1 1.193 1.807 5.417 5.417 0 1 0 5.977 0A1.084 1.084 0 1 1 17.18 6.68 7.58 7.58 0 0 1 13 20.584Z"
        />
    </Svg>
)
export default SvgComponent
