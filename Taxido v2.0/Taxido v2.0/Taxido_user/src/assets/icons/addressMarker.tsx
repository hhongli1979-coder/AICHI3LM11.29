import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useValues } from "@src/utils/context/index";
import { appColors } from "@src/themes";

export function AddressMarker() {
  const { isDark } = useValues();
  return (
    <Svg width={22} height={22}>
      <Path
        d="M9 10.074a2.341 2.341 0 0 0 0-4.682 2.34 2.34 0 0 0 0 4.682Zm0 0"
        fillRule="nonzero"
        fill="#199675"
        fillOpacity={1}
        stroke="#199675"
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeOpacity={1}
        strokeMiterlimit={4}
        transform="scale(1.22222)"
      />
      <Path
        d="M2.717 6.366c1.476-6.494 11.1-6.487 12.57.01.86 3.81-1.509 7.035-3.586 9.029a3.897 3.897 0 0 1-5.408 0c-2.071-1.994-4.44-5.229-3.576-9.039Zm0 0"
        fill="none"
        stroke={isDark ? appColors.whiteColor : "#1f1f1f"}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeOpacity={1}
        strokeMiterlimit={4}
        transform="scale(1.22222)"
      />
    </Svg>
  );
}
