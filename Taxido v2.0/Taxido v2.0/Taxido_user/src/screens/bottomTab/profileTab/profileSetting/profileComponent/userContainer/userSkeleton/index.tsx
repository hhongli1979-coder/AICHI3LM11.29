
import React from "react";
import { View } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import styles from "./styles";
import { appColors, windowHeight } from "@src/themes";
import { useValues } from "@src/utils/context/index";;


export function UserContainerSkeleton() {
    const { isDark } = useValues();

    return (
        <View>
            <ContentLoader
                speed={1}
                width="100%"
                height={
                    styles.walletContain.height +
                    styles.detainContain.marginVertical * 2 +
                    styles.profileImage.height
                }
                backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
                foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
            >
                <Circle
                    cx={styles.detainContain.marginHorizontal + styles.profileImage.width / 2}
                    cy={styles.profileImage.height / 2 + styles.detainContain.marginVertical}
                    r={styles.profileImage.width / 2}
                />

                <Rect
                    x={styles.profileImage.width + styles.detainContain.marginHorizontal * 2}
                    y={styles.detainContain.marginVertical + styles.details.top + windowHeight(5)}
                    width={styles.name.width}
                    height={styles.name.height}
                    rx={0}
                    ry={0}
                    style={{ borderRadius: 0 }}
                />

                <Rect
                    x={styles.walletContain.marginHorizontal}
                    y={styles.profileImage.height + styles.detainContain.marginVertical * 5}
                    width={styles.walletContain.width}
                    height={styles.walletContain.height}
                    rx={0}
                    ry={0}
                    style={{ borderRadius: 0 }}
                />
            </ContentLoader>
        </View>
    );
}
