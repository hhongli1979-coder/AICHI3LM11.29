import React from "react";
import { View } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import styles from "./styles";
import { useValues } from "@src/utils/context/index";;
import { useTheme } from "@react-navigation/native";
import { appColors, windowHeight, windowWidth } from "@src/themes";

export function RideLoader() {
    const { isDark } = useValues();
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.rideInfoContainer,
                    {
                        backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor,
                        borderColor: colors.border,
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
                        cx={windowWidth(30)}
                        cy={windowHeight(22)}
                        r={windowWidth(30)}
                    />
                    <Rect x={windowWidth(75)} y={windowHeight(14)} width={windowWidth(140)} height={windowHeight(15)} rx={0} />
                    <Rect x={windowWidth(310)} y={windowHeight(8)} width={windowWidth(41)} height={windowHeight(28)} rx={windowHeight(15)} ry={windowHeight(15)} />
                    <Rect x={windowWidth(363)} y={windowHeight(8)} width={windowWidth(41)} height={windowHeight(28)} rx={windowHeight(15)} ry={windowHeight(15)} />
                    <Rect x={windowWidth(1)} y={windowHeight(60)} width={windowWidth(290)} height={windowHeight(15)} rx={0} />
                    <Rect x={windowWidth(1)} y={windowHeight(84)} width={windowWidth(350)} height={windowHeight(15)} rx={0} />
                    <Rect x={windowWidth(1)} y={windowHeight(110)} width={windowWidth(399)} height={windowHeight(70.3)} rx={0} />
                </ContentLoader>
            </View>
            <View
                style={[
                    styles.rideInfoContainer1,
                    {
                        backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor,
                    },
                ]}
            >
                <ContentLoader
                    speed={2}
                    width={windowWidth(800)}
                    height={windowHeight(55)}
                    backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                    foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
                >
                    <Rect x={windowWidth(14)} y={windowHeight(10)} width={windowHeight(230)} height={windowHeight(17)} rx={0} />
                    <Rect x={windowWidth(14)} y={windowHeight(38)} width={windowHeight(270)} height={windowHeight(17)} rx={0} />
                </ContentLoader>
            </View>
        </View>
    );
}
