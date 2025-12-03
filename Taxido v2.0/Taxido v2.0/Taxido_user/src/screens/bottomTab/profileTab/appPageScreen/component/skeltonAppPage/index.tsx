import React from "react";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { View } from "react-native";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";

export function SkeltonAppPage() {
    const { isDark } = useValues();

    return (
        <View>
            <ContentLoader
                speed={1.5}
                width="100%"
                height={windowHeight(40)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowHeight(18)}
                    cy={windowHeight(18)}
                    r={windowHeight(18)}
                />

                <Rect
                    x={windowHeight(50)}
                    y={windowHeight(12)}
                    width={windowWidth(100)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />

                <Rect
                    x={windowHeight(240)}
                    y={windowHeight(12)}
                    width={windowWidth(60)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />
            </ContentLoader>
            <View style={{ marginTop: windowHeight(12) }} />
            <ContentLoader
                speed={1.5}
                width="100%"
                height={windowHeight(40)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowHeight(18)}
                    cy={windowHeight(18)}
                    r={windowHeight(18)}
                />

                <Rect
                    x={windowHeight(50)}
                    y={windowHeight(12)}
                    width={windowWidth(100)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />

                <Rect
                    x={windowHeight(240)}
                    y={windowHeight(12)}
                    width={windowWidth(60)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />
            </ContentLoader>
            <View style={{ marginTop: windowHeight(12) }} />
            <ContentLoader
                speed={1.5}
                width="100%"
                height={windowHeight(40)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowHeight(18)}
                    cy={windowHeight(18)}
                    r={windowHeight(18)}
                />

                <Rect
                    x={windowHeight(50)}
                    y={windowHeight(12)}
                    width={windowWidth(100)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />

                <Rect
                    x={windowHeight(240)}
                    y={windowHeight(12)}
                    width={windowWidth(60)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />
            </ContentLoader>
            <View style={{ marginTop: windowHeight(12) }} />
            <ContentLoader
                speed={1.5}
                width="100%"
                height={windowHeight(40)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowHeight(18)}
                    cy={windowHeight(18)}
                    r={windowHeight(18)}
                />

                <Rect
                    x={windowHeight(50)}
                    y={windowHeight(12)}
                    width={windowWidth(100)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />

                <Rect
                    x={windowHeight(240)}
                    y={windowHeight(12)}
                    width={windowWidth(60)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />
            </ContentLoader>
            <View style={{ marginTop: windowHeight(12) }} />
            <ContentLoader
                speed={1.5}
                width="100%"
                height={windowHeight(40)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowHeight(18)}
                    cy={windowHeight(18)}
                    r={windowHeight(18)}
                />

                <Rect
                    x={windowHeight(50)}
                    y={windowHeight(12)}
                    width={windowWidth(100)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />

                <Rect
                    x={windowHeight(240)}
                    y={windowHeight(12)}
                    width={windowWidth(60)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />
            </ContentLoader>
            <View style={{ marginTop: windowHeight(12) }} />
            <ContentLoader
                speed={1.5}
                width="100%"
                height={windowHeight(40)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowHeight(18)}
                    cy={windowHeight(18)}
                    r={windowHeight(18)}
                />

                <Rect
                    x={windowHeight(50)}
                    y={windowHeight(12)}
                    width={windowWidth(100)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />

                <Rect
                    x={windowHeight(240)}
                    y={windowHeight(12)}
                    width={windowWidth(60)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />
            </ContentLoader>
            <View style={{ marginTop: windowHeight(12) }} />
            <ContentLoader
                speed={1.5}
                width="100%"
                height={windowHeight(40)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowHeight(18)}
                    cy={windowHeight(18)}
                    r={windowHeight(18)}
                />

                <Rect
                    x={windowHeight(50)}
                    y={windowHeight(12)}
                    width={windowWidth(100)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />

                <Rect
                    x={windowHeight(240)}
                    y={windowHeight(12)}
                    width={windowWidth(60)}
                    height={windowHeight(14)}
                    rx={0}
                    ry={0}
                />
            </ContentLoader>
        </View>
    );
}


