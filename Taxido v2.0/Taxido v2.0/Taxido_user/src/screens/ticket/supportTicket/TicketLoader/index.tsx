import React from "react";
import { View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import styles from "./styles";

export function TicketLoader() {
    const { isDark } = useValues();
    return (
        <View
            style={[styles.container, {
                backgroundColor: isDark ? appColors.darkHeader : appColors.loaderBackground,
                borderColor: isDark ? appColors.darkBorder : appColors.lightGray,
            }]}
        >
            <ContentLoader
                speed={1.5}
                width={windowWidth(450)}
                height={windowHeight(138)}
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Rect x={windowWidth(4)} y={windowHeight(9)} width="25%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(320)} y={windowHeight(9)} width="18%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(4)} y={windowHeight(28)} width="36%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(4)} y={windowHeight(60)} width="88%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(4)} y={windowHeight(80)} width="36%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(4)} y={windowHeight(120)} width="45%" height={windowHeight(13.5)} rx={0} />
                <Rect x={windowWidth(227)} y={windowHeight(120)} width="25%" height={windowHeight(13.5)} rx={0} />
            </ContentLoader>
        </View>
    );
}
