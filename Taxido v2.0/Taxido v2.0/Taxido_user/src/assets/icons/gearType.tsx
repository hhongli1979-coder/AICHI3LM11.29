import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import React from "react";
import { appColors } from "@src/themes";
import SvgComponentProps from "./type";

export function GearType({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={22} fill="none">
      <G stroke={color || appColors.regularText} strokeWidth={1.2} clipPath="url(#a)">
        <Path
          strokeMiterlimit={10}
          d="M2.879.86a2.02 2.02 0 1 1 0 4.038 2.02 2.02 0 0 1 0-4.039ZM11.086.86a2.02 2.02 0 1 1 0 4.038 2.02 2.02 0 0 1 0-4.039ZM2.879 17.102a2.02 2.02 0 1 1 0 4.039 2.02 2.02 0 0 1 0-4.04ZM11.086 17.102a2.02 2.02 0 1 1 0 4.039 2.02 2.02 0 0 1 0-4.04ZM19.121.86a2.02 2.02 0 1 1 0 4.038 2.02 2.02 0 0 1 0-4.039Z"
        />
        <Path
          strokeMiterlimit={10}
          d="M2.879 17.127v-4.409c0-.949.77-1.718 1.719-1.718M11.086 4.984v12.143M19.121 4.898v4.383c0 .95-.77 1.719-1.719 1.719H4.598c-.95 0-1.72-.77-1.72-1.719V4.984M17.617 18.52h1.998a1.525 1.525 0 1 0 0-3.051h-1.998V22"
        />
        <Path d="m20.99 21.4-1.07-2.1h-.565l-.128-.427-.043-.142-.108.054 1.332 2.615h.582Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
