import { View, Text, Image } from "react-native";
import React from "react";
import { useValues } from "@src/utils/context/index";;
import { CustomRadioButton } from "@src/commonComponent/radioButton/customRadioButton";
import { useTheme } from "@react-navigation/native";
import styles from "./styles";

const PaymentOption = ({ imageSource, text, selected, onPress }) => {
  const { colors } = useTheme();
  const { viewRTLStyle } = useValues();

  return (
    <View style={[styles.main, { flexDirection: viewRTLStyle }]}>
      <View
        style={[
          styles.subContainer,
          {
            flexDirection: viewRTLStyle,
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.imageView} />
        </View>
        <Text
          style={{
            color: colors.text,
          }}
        >
          {text}
        </Text>
      </View>
      <CustomRadioButton selected={selected} onPress={onPress} />
    </View>
  );
};

export default PaymentOption;
