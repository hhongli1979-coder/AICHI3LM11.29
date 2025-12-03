import React from "react";
import { windowHeight, appColors } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import ContentLoader, { Rect } from "react-content-loader/native";

export function SkeletonEditImage() {
  const { isDark } = useValues();

  return (
    <ContentLoader
      speed={1}
      width={windowHeight(75)}
      height={windowHeight(75)}
      viewBox={`0 0 ${windowHeight(75)} ${windowHeight(75)}`}
      backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
      foregroundColor={
        isDark ? appColors.darkPrimary : appColors.loaderLightHighlight
      }
    >
      <Rect
        x="0"
        y="0"
        rx={windowHeight(37.5)}
        ry={windowHeight(37.5)}
        width={windowHeight(75)}
        height={windowHeight(75)}
      />
      <Rect
        x={windowHeight(51)}
        y={windowHeight(52)}
        rx={windowHeight(12)}
        ry={windowHeight(12)}
        width={windowHeight(24)}
        height={windowHeight(24)}
      />
    </ContentLoader>
  );
}
