import { Image, SafeAreaView, View } from "react-native";
import React from "react";
import styles from "./style";
import { external } from "../../../styles/externalStyle";
import Images from "@utils/images";
import { windowHeight } from "@src/themes";
import { appColors } from "@src/themes";
import { useValues } from "@src/utils/context/index";
import { AuthContainerProps } from "../type";

export function AuthContainer({ container, imageShow }: AuthContainerProps) {
  const { isDark, linearColorStyle, bgContainer } = useValues();
  const imageDark = isDark ? Images.authBgDark : Images.authBg;

  return (
    <SafeAreaView style={[external.fx_1, { backgroundColor: appColors.whiteColor }]}>
      <View style={{ height: windowHeight(50), backgroundColor: isDark ? linearColorStyle : appColors.lightGray }}>
        {imageShow && (
          <Image
            style={styles.img}
            source={isDark ? Images.splashDark : Images.splash}
          />
        )}
      </View>
      <View style={[styles.imageMainView, { backgroundColor: isDark ? linearColorStyle : appColors.lightGray }]}>
        <View style={styles.imageView}>
          <Image style={[styles.backgroundImage]} source={imageDark} />
        </View>

        <View style={styles.contentContainer}>
          <View
            style={[styles.container, { backgroundColor: bgContainer }]}
          >
            <View>{container}</View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
