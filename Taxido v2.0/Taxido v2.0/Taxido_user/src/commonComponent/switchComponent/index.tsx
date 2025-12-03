import React from "react";
import { View } from "react-native";
import SwitchToggle from "react-native-switch-toggle";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { styles } from "./style";
import { useValues } from "@src/utils/context/index";
import { SwitchProps } from "../type";


export function SwitchComponent({ Enable, onPress }: SwitchProps) {
  const { isDark } = useValues();
  const backgroundColorOff = isDark
    ? appColors.lightGray
    : appColors.whiteColor;
  return (
    <View>
      <SwitchToggle
        circleColorOff={appColors.regularText}
        circleColorOn={appColors.primaryGray}
        backgroundColorOn={appColors.primary}
        backgroundColorOff={backgroundColorOff}
        switchOn={Enable}
        onPress={onPress}
        circleStyle={styles.circle}
        containerStyle={{
          width: windowWidth(52),
          height: windowHeight(20),
          borderRadius: windowHeight(14),
          paddingRight: windowWidth(55),
          paddingLeft: windowWidth(2.5),
          borderWidth: windowHeight(1),
          borderColor: isDark ? appColors.switchGray : appColors.border,
        }}
      />
    </View>
  );
}
