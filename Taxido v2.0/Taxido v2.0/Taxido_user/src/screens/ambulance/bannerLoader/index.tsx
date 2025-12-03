import React from "react";
import { StyleSheet, View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";;

export function BannerLoader() {
    const { isDark } = useValues();
    return (
        <View style={styles.main}>
            <ContentLoader
                speed={2}
                width={windowWidth(440)}
                height={windowHeight(155)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Rect x="0" y="0" width="100%" height={windowHeight(140)} rx={windowHeight(8)} />
            </ContentLoader>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        alignItems: "center",
        width: "100%",
        top: windowHeight(13),
    },
})