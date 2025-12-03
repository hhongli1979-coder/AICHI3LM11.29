import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export function RatingEmptyStart() {
  return (
    <Svg width={14} height={14} fill="none">
      <G clipPath="url(#a)">
        <Path
          stroke="#FFB400"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.01 2.054 1.027 2.07c.14.288.513.565.828.617l1.86.312c1.19.2 1.47 1.07.613 1.93L10.892 8.44c-.245.247-.38.723-.304 1.064l.414 1.805c.327 1.43-.426 1.982-1.68 1.235l-1.744-1.04c-.315-.189-.834-.189-1.155 0l-1.744 1.04c-1.248.747-2.007.189-1.68-1.235l.414-1.805c.076-.341-.058-.817-.303-1.064L1.663 6.982c-.851-.859-.577-1.729.613-1.929l1.86-.312c.31-.052.683-.329.823-.617l1.027-2.07c.56-1.123 1.47-1.123 2.024 0Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h14v14H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
