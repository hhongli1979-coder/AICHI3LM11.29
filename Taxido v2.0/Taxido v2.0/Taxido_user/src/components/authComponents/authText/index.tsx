import { Text, View } from "react-native";
import React from "react";
import { commonStyles } from "../../../styles/commonStyle";
import { external } from "../../../styles/externalStyle";
import Images from "@utils/images";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import { useValues } from "@src/utils/context/index";
import { AuthTextProps } from "../type";

export function AuthText({ title, subtitle }: AuthTextProps) {
  const { textColorStyle, textRTLStyle, isRTL, isDark } = useValues();

  return (
    <View>
      <View>
        <FastImage style={[styles.transformLine, { marginLeft: isRTL ? '82%' : -35 }]} source={isDark ? Images.darkLine : Images.line} />
      </View>
      <Text
        style={[
          commonStyles.regularTextBigBlack,
          { color: textColorStyle },
          { textAlign: textRTLStyle },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          commonStyles.regularText,
          external.pt_8,
          { textAlign: textRTLStyle },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
}
