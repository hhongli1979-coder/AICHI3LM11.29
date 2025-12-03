import React from "react";
import { View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";;

export function CategoryLoader() {
    const { isDark } = useValues();
    const loaders = new Array(4).fill(null);

    const backgroundColor = isDark ? appColors.bgDark : appColors.loaderBackground;
    const foregroundColor = isDark ? appColors.darkPrimary : appColors.loaderLightHighlight;

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: windowWidth(5.9),
                left: windowHeight(4)
            }}
        >
            {loaders.map((_, index) => (
                <ContentLoader
                    key={index}
                    speed={2}
                    width={90}
                    height={80}
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                    style={{ marginHorizontal: windowWidth(2.8) }}
                >
                    <Rect x={windowHeight(7)} y="10" width={windowHeight(50)} height={windowHeight(45)} rx={windowHeight(4)} />
                    <Rect x={windowHeight(7.5)} y={windowHeight(58)} rx={windowHeight(2.5)} ry={windowHeight(2.5)} width={windowHeight(49)} height={windowHeight(8)} />
                </ContentLoader>
            ))}
        </View>
    );
}
