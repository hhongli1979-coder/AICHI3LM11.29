import { useValues } from "@src/utils/context/index";
import { appColors } from "@src/themes"
import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"


export function Alarm() {
  const { isDark } = useValues()
  return (
    <Svg
      width={18}
      height={18}
      fill="none"
    >
      <Circle cx={9} cy={9.75} r={6.75} stroke={isDark ? appColors.whiteColor : appColors.primaryText} strokeWidth={1.5} />
      <Path
        stroke={isDark ? appColors.whiteColor : appColors.primaryText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 6.75v3l1.875 1.875M2.625 3.375l3-1.875M15.375 3.375l-3-1.875"
      />
    </Svg>
  )
}
