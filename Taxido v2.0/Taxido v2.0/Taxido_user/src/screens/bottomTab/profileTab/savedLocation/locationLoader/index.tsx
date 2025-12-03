import React from "react";
import { windowHeight, windowWidth } from "@src/themes";
import { appColors } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";

export function LocationLoader() {
    const { isDark } = useValues()
    const { colors } = useTheme()
    return (
        <View
            style={[
                {
                    backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor,
                    borderColor: colors.border,
                    width: "90%",
                    borderRadius: windowHeight(5.9),
                    paddingHorizontal: windowHeight(12),
                    paddingTop: windowHeight(12),
                    paddingVertical: windowHeight(9),
                    height: windowHeight(105),
                    alignSelf: 'center',
                    top: windowHeight(10)
                },
            ]}
        >
            <ContentLoader
                speed={2}
                width={windowWidth(800)}
                height={windowHeight(500)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={windowWidth(28)}
                    cy={windowHeight(22)}
                    r={windowWidth(28)}
                />
                <Rect x={windowWidth(75)} y={windowHeight(14)} width={windowWidth(120)} height={windowHeight(15)} rx={0} />
                <Rect x={windowWidth(266)} y={windowHeight(8)} width={windowWidth(39)} height={windowHeight(26)} rx={windowHeight(15)} ry={windowHeight(15)} />
                <Rect x={windowWidth(315)} y={windowHeight(8)} width={windowWidth(39)} height={windowHeight(26)} rx={windowHeight(15)} ry={windowHeight(15)} />
                <Rect x={windowWidth(363)} y={windowHeight(8)} width={windowWidth(39)} height={windowHeight(26)} rx={windowHeight(15)} ry={windowHeight(15)} />
                <Rect x={windowWidth(3)} y={windowHeight(60)} width={windowWidth(33)} height={windowHeight(22)} rx={windowHeight(13)} ry={windowHeight(15)} />
                <Rect x={windowWidth(53)} y={windowHeight(63.5)} width={windowWidth(320)} height={windowHeight(13)} rx={0} />
            </ContentLoader>

        </View>
    )
}