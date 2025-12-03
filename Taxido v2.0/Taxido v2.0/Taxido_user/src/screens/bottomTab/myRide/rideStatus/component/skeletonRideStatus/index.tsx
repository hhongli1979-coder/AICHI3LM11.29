import React from "react";
import { useValues } from "@src/utils/context/index";;
import { windowHeight, appColors } from "@src/themes";
import { View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import styles from "./styles";

export function SkeletonRideStatus() {
    const { isDark, viewRTLStyle } = useValues()
    return (
        <View style={styles.mainContainer}>
            <View style={[styles.container, { flexDirection: viewRTLStyle }]}>
                {[...Array(5)].map((_, index) => (
                    <ContentLoader
                        key={index}
                        speed={1.5}
                        width={80}
                        height={35}
                        backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                        foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
                        style={{ marginHorizontal: windowHeight(2.8) }}
                    >
                        <Rect x="0" y="0" rx="0" ry="0" width={windowHeight(59)} height={windowHeight(24)} />
                    </ContentLoader>
                ))}
            </View>
        </View>
    )
}