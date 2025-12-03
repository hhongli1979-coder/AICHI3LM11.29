import React from "react";
import { useValues } from "@src/utils/context/index";;
import { windowHeight, windowWidth } from "@src/themes";
import { appColors } from "@src/themes";
import { useTheme } from "@react-navigation/native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";

export function CouponLoader() {
    const { isDark } = useValues()
    const { colors } = useTheme()
    return (
        <View
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingHorizontal: windowWidth(15),
                paddingBottom: windowHeight(10),
                borderRadius: windowHeight(5),
                marginHorizontal: windowWidth(8),
                marginTop: windowHeight(15),
            }}
        >
            <ContentLoader
                width={windowWidth(450)}
                height={windowHeight(100)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Rect x={windowWidth(4)} y={windowHeight(9)} width="80%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(4)} y={windowHeight(28)} width="60%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(4)} y={windowHeight(60)} width="50%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(4)} y={windowHeight(83)} width="23%" height={windowHeight(15.5)} rx={0} />

                <Rect x={windowWidth(315)} y={windowHeight(83)} width="20%" height={windowHeight(15.5)} rx={0} />
            </ContentLoader>
        </View>
    )
}