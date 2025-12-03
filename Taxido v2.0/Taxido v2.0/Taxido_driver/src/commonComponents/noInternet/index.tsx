import React from "react";
import styles from "./styles";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useValues } from "../../utils/context";
import appColors from "../../theme/appColors";
import { Menu, MenuOptions, MenuTrigger, renderers } from "react-native-popup-menu";
import Images from "../../utils/images/images";
import { useSelector } from "react-redux";

export function NoInternet() {
  const { Popover } = renderers;
  const { isDark, viewRtlStyle } = useValues();
  const { translateData } = useSelector((state: any) => state.setting)


  return (
    <View style={styles.mainContainer}>
      <FastImage
        source={Images.noInternet}
        style={styles.image}
      />
      <View style={[{ flexDirection: viewRtlStyle }]}>
        <Text style={[styles.title, { color: isDark ? appColors.white : appColors.black }]}>
          {translateData.noInternetConnectionText}
        </Text>
        <Menu
          renderer={Popover}
          rendererProps={{ preferredPlacement: "bottom" }}>
          <MenuTrigger>
          </MenuTrigger>
          <MenuOptions>
          </MenuOptions>
        </Menu>
      </View>
      <Text style={styles.details}>
        {translateData.plzzConnectionCheck}
      </Text>
    </View>
  );
}
