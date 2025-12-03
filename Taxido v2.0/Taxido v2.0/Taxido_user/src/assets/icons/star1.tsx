import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export function Star1() {
  return (
    <Svg width={16} height={16} fill="none">
      <G clipPath="url(#a)">
        <Path
          fill="#FFB400"
          stroke="#FFB400"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m9.153 2.34 1.174 2.346c.16.327.586.64.946.7l2.127.354c1.36.226 1.68 1.213.7 2.186L12.447 9.58c-.28.28-.434.82-.347 1.206l.473 2.047c.374 1.62-.486 2.247-1.92 1.4l-1.993-1.18c-.36-.213-.953-.213-1.32 0l-1.993 1.18c-1.427.847-2.294.213-1.92-1.4l.473-2.047c.087-.386-.067-.926-.347-1.206L1.9 7.926c-.973-.973-.66-1.96.7-2.186l2.127-.354c.353-.06.78-.373.94-.7L6.84 2.34c.64-1.274 1.68-1.274 2.313 0Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
