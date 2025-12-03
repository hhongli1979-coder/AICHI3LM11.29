import React from "react";
import { windowHeight, appColors, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import ContentLoader, { Rect } from "react-content-loader/native";

export function SkeletonProfiletTittle() {
  const { isDark } = useValues()
  return (

    <ContentLoader
      speed={1.5}
      width="100%"
      height={windowHeight(30)}
      backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
      foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
    >
      <Rect
        x={windowHeight(4)}
        y={windowHeight(12)}
        width={windowWidth(150)}
        height={windowHeight(14)}
        rx={0}
        ry={0}
      />
    </ContentLoader>
  );
}