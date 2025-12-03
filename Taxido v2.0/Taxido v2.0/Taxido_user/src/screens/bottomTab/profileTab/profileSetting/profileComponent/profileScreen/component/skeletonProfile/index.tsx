import React from "react";
import { windowHeight, appColors } from "@src/themes";
import ContentLoader, { Rect } from "react-content-loader/native";
import { useValues } from "@src/utils/context/index";;

export function SkeletonProfile() {
    const { isDark } = useValues()
    return (
        <ContentLoader
            speed={1}
            width="100%"
            height={56}
            viewBox="0 0 340 50"
            backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
            foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
        >
            <Rect
                x="0" y="0" rx={windowHeight(25)} ry={windowHeight(25)} width={windowHeight(37)} height={windowHeight(37)} />
            <Rect
                x="18%" y="28%" rx="0" ry="0" width={windowHeight(85)} height={windowHeight(14)} />
        </ContentLoader>
    )
}