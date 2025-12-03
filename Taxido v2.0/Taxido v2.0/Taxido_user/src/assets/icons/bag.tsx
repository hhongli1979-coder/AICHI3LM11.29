import { appColors } from "@src/themes";
import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import SvgComponentProps from "./type";

export function Bag({ color }: SvgComponentProps) {
  return (
    <Svg width={22} height={23} fill="none">
      <G
        stroke={color || appColors.regularText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        clipPath="url(#a)"
      >
        <Path d="M7.721 21.422a1.29 1.29 0 0 1-1.289-1.29v-.859H9.01v.86a1.29 1.29 0 0 1-1.289 1.289ZM14.279 21.422a1.29 1.29 0 0 0 1.289-1.29v-.859h-2.579v.86c0 .712.578 1.289 1.29 1.289ZM15.966 5.377H6.034c-.688 0-1.245.558-1.245 1.246v11.405c0 .688.557 1.245 1.245 1.245h9.934c.687 0 1.245-.557 1.245-1.245V6.623c0-.688-.558-1.246-1.245-1.246ZM13.012.71H8.988v4.667h4.024V.71ZM7.926.71h6.148" />
        <Path d="m5.1 5.8 2.597 2.596a3.135 3.135 0 0 0 2.217.918H11M11 9.314h1.086c.831 0 1.628-.33 2.217-.918L16.9 5.8M11 11.892v4.835M8.207 11.892v4.835M13.793 11.892v4.835" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 .066h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
