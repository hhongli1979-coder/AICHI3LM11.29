import { useValues } from "@src/utils/context";
import * as React from "react"
import Svg, { Path } from "react-native-svg"


export default function ReferralId({ color }: any) {
  const { iconColorStyle } = useValues();
  const strokeColor = color || iconColorStyle;
  return (
    <Svg width={18} height={18} fill="none">
      <Path
        stroke={strokeColor ? strokeColor : "#1F1F1F"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M12.746 3h-7.5c-2.872 0-3.675.69-3.742 3.375A2.621 2.621 0 0 1 4.12 9a2.626 2.626 0 0 1-2.617 2.625C1.57 14.31 2.374 15 5.246 15h7.5c3 0 3.75-.75 3.75-3.75v-4.5c0-3-.75-3.75-3.75-3.75ZM6.745 3v2.625M6.745 12.375V15"
      />
      <Path
        stroke={strokeColor ? strokeColor : "#1F1F1F"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="m11.269 6.997.465.937c.045.09.135.158.232.173l1.036.15c.255.037.36.352.172.532l-.75.728a.31.31 0 0 0-.09.277l.18 1.028a.311.311 0 0 1-.45.33l-.922-.488a.334.334 0 0 0-.293 0l-.922.488a.31.31 0 0 1-.45-.33l.18-1.028a.317.317 0 0 0-.09-.277l-.743-.728a.312.312 0 0 1 .173-.532l1.034-.15a.293.293 0 0 0 .233-.173l.458-.937c.104-.233.434-.233.547 0Z"
      />
    </Svg>
  )
}