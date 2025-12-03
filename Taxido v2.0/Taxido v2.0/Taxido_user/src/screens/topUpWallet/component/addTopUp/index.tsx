import { View, Text, TextInput } from "react-native";
import React from "react";
import { Button } from "@src/commonComponent";
import { appColors } from "@src/themes";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useValues } from "@src/utils/context/index";;
import { DollarCoin } from "@src/utils/icons";


const AddTopUp = () => {
  const { colors } = useTheme();
  const { viewRTLStyle, textRTLStyle } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.addBalance,
          { color: colors.text, textAlign: textRTLStyle },
        ]}
      >
        {translateData.addTopupBalance}
      </Text>
      <Text style={[styles.amount, { textAlign: textRTLStyle }]}>
        {translateData.enterAmount}
      </Text>

      <View style={styles.subContainer}>
        <View
          style={[
            styles.inputView,
            {
              backgroundColor: colors.card,
              flexDirection: viewRTLStyle,
              borderColor: colors.border,
            },
          ]}
        >
          <DollarCoin />
          <TextInput
            style={[
              styles.textinput,
              { backgroundColor: colors.card, color: colors.text },
            ]}
            placeholder={translateData.amount}
            placeholderTextColor={appColors.regularText}
            keyboardType={"numeric"}
          />
        </View>
        <View>
          <Button
            backgroundColor={appColors.alertBg}
            textColor={appColors.whiteColor}
            title={translateData.withdrawBalance}
            width={0}
          />
        </View>
      </View>
    </View>
  );
};

export default AddTopUp;
