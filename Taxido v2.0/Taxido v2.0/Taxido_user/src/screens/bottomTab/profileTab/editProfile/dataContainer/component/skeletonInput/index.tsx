import React from "react";
import { windowHeight, appColors } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import ContentLoader, { Rect } from "react-content-loader/native";

export function SkeletonInput({ x = "0", width = "100%", height = windowHeight(38) }) {
  const { isDark } = useValues();

  return (
    <ContentLoader
      speed={1}
      width="100%"
      height={height}
      viewBox="13 0 340 50"
      backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
      foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
    >
      <Rect x={x} y="0" rx="0" ry="0" width={width} height={height} />
    </ContentLoader>
  );
}
