import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import React from "react";

export function Facebook() {
  return (
    <Svg width={22} height={22} fill="none">
      <G clipPath="url(#a)">
        <Path
          fill="#1877F2"
          d="M22 11c0 5.49-4.023 10.041-9.281 10.866V14.18h2.563L15.77 11h-3.051V8.937c0-.87.426-1.718 1.792-1.718h1.387V4.512s-1.258-.215-2.462-.215c-2.512 0-4.155 1.523-4.155 4.28V11H6.488v3.18h2.793v7.686C4.023 21.041 0 16.491 0 11 0 4.925 4.925 0 11 0s11 4.925 11 11Z"
        />
        <Path
          fill="#fff"
          d="M15.282 14.18 15.77 11h-3.051V8.937c0-.87.426-1.718 1.792-1.718h1.387V4.512s-1.258-.215-2.462-.215c-2.512 0-4.155 1.523-4.155 4.28V11H6.488v3.18h2.793v7.686a11.08 11.08 0 0 0 3.438 0V14.18h2.563Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
